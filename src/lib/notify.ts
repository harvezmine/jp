import "server-only";

import {
  COMPANION_LABEL,
  HELP_CATEGORY_LABEL,
  HELP_SOURCE_LABEL,
  PRAYER_FOR_LABEL,
  URGENCY_LABEL,
  type HelpRequest,
} from "@/lib/types";
import { site } from "@/lib/site";

/**
 * Notifikasi pengurus saat ada permohonan pertolongan baru.
 *
 * Prinsip: notifikasi TIDAK PERNAH menggagalkan submit. Kalau token belum diisi
 * atau provider sedang down, permohonan tetap tersimpan di inbox admin dan
 * kegagalan hanya dicatat di log server.
 *
 * Isi pesan sengaja dibuat minim: untuk permohonan yang ditandai rahasia,
 * detailnya tidak ikut dikirim ke WA/email; pengurus harus membukanya di
 * admin panel yang terlindungi login.
 */

type NotifyResult = { channel: string; ok: boolean; detail?: string };

const HELP_URL = `${site.url}/admin/permohonan`;

/** Asal formulir dan jawaban khusus Doa/Cerita, sebagai pasangan label dan nilai. */
function extraRows(req: HelpRequest): [string, string][] {
  const rows: [string, string][] = [["Formulir", HELP_SOURCE_LABEL[req.source] ?? HELP_SOURCE_LABEL.umum]];
  if (req.details?.prayer_for) rows.push(["Doa untuk", PRAYER_FOR_LABEL[req.details.prayer_for]]);
  if (req.details?.companion) rows.push(["Pendamping", COMPANION_LABEL[req.details.companion]]);
  return rows;
}

function buildSummary(req: HelpRequest) {
  const nama = req.is_anonymous ? "Anonim" : req.name || "Tanpa nama";
  const lines = [
    `🕊️ *Permohonan baru: ${req.ref_code}*`,
    "",
    `Nama     : ${nama}`,
    `Kategori : ${HELP_CATEGORY_LABEL[req.category]}`,
    `Urgensi  : ${URGENCY_LABEL[req.urgency]}`,
  ];

  for (const [label, value] of extraRows(req)) lines.push(`${label}: ${value}`);

  if (req.city) lines.push(`Kota     : ${req.city}`);

  if (req.is_confidential) {
    lines.push("", "🔒 Ditandai *rahasia*. Isi pesan hanya bisa dibaca di admin panel.");
  } else {
    const preview = req.message.length > 300 ? `${req.message.slice(0, 300)}…` : req.message;
    lines.push("", `Pesan:`, preview);
  }

  lines.push("", `Buka: ${HELP_URL}`);
  return lines.join("\n");
}

async function sendWhatsApp(req: HelpRequest): Promise<NotifyResult | null> {
  const token = process.env.FONNTE_TOKEN;
  const target = process.env.NOTIFY_WA_TO;
  if (!token || !target) return null;

  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ target, message: buildSummary(req), countryCode: "62" }),
      signal: AbortSignal.timeout(8000),
    });
    return { channel: "whatsapp", ok: res.ok, detail: res.ok ? undefined : await res.text() };
  } catch (err) {
    return { channel: "whatsapp", ok: false, detail: String(err) };
  }
}

async function sendEmail(req: HelpRequest): Promise<NotifyResult | null> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!key || !to || !from) return null;

  const urgencyColor =
    req.urgency === "darurat" ? "#b91c1c" : req.urgency === "mendesak" ? "#c2963f" : "#74222f";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#241c19">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#97765d;margin:0 0 4px">
        Janji Pengharapan
      </p>
      <h1 style="font-size:20px;margin:0 0 16px">Permohonan pertolongan baru</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#97765d;width:110px">Kode</td><td><strong>${req.ref_code}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#97765d">Nama</td><td>${
          req.is_anonymous ? "<em>Anonim</em>" : escapeHtml(req.name || "-")
        }</td></tr>
        <tr><td style="padding:6px 0;color:#97765d">Kategori</td><td>${HELP_CATEGORY_LABEL[req.category]}</td></tr>
        ${extraRows(req)
          .map(([label, value]) => `<tr><td style="padding:6px 0;color:#97765d">${label}</td><td>${value}</td></tr>`)
          .join("")}
        <tr><td style="padding:6px 0;color:#97765d">Urgensi</td><td style="color:${urgencyColor};font-weight:600">${URGENCY_LABEL[req.urgency]}</td></tr>
        ${req.city ? `<tr><td style="padding:6px 0;color:#97765d">Kota</td><td>${escapeHtml(req.city)}</td></tr>` : ""}
      </table>
      <div style="margin:20px 0;padding:16px;background:#faf4ec;border-left:3px solid #74222f;border-radius:8px;font-size:14px;line-height:1.7">
        ${
          req.is_confidential
            ? "<em>Permohonan ini ditandai rahasia. Isi pesan hanya dapat dibaca melalui admin panel.</em>"
            : escapeHtml(req.message).replace(/\n/g, "<br>")
        }
      </div>
      <a href="${HELP_URL}" style="display:inline-block;background:#74222f;color:#fdfaf6;text-decoration:none;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:600">
        Buka di admin panel
      </a>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: `[${req.urgency === "darurat" ? "DARURAT" : "Permohonan"}] ${req.ref_code}, ${HELP_CATEGORY_LABEL[req.category]}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return { channel: "email", ok: res.ok, detail: res.ok ? undefined : await res.text() };
  } catch (err) {
    return { channel: "email", ok: false, detail: String(err) };
  }
}

export async function notifyNewHelpRequest(req: HelpRequest) {
  const results = await Promise.all([sendWhatsApp(req), sendEmail(req)]);

  for (const r of results) {
    if (r && !r.ok) {
      console.error(`[notify] ${r.channel} gagal untuk ${req.ref_code}:`, r.detail);
    }
  }
  return results.filter(Boolean) as NotifyResult[];
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
