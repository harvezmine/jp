"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewHelpRequest } from "@/lib/notify";
import { makeRefCode } from "@/lib/utils";
import type { HelpRequest } from "@/lib/types";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  refCode?: string;
  /** Error per field, dipakai untuk menandai input yang bermasalah. */
  fieldErrors?: Record<string, string>;
};

const HELP_CATEGORIES = ["doa", "konseling", "kebutuhan", "kunjungan", "keuangan", "lainnya"];
const URGENCIES = ["biasa", "mendesak", "darurat"];
const CONTACT_PREFS = ["whatsapp", "telepon", "email", "tidak_perlu"];

function clean(value: FormDataEntryValue | null, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Menerima permohonan pertolongan.
 *
 * Ditulis lewat service-role client, bukan sesi pemohon: dengan begitu tabel
 * help_requests tidak perlu membuka akses baca apa pun ke publik, sementara
 * siapa saja tetap bisa mengirim — termasuk yang memilih anonim.
 */
export async function submitHelpRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: bot mengisi field tersembunyi ini, manusia tidak.
  if (clean(formData.get("website"))) {
    return { status: "success", refCode: makeRefCode() };
  }

  const isAnonymous = formData.get("is_anonymous") === "on";
  const isConfidential = formData.get("is_confidential") === "on";

  const name = isAnonymous ? "" : clean(formData.get("name"), 120);
  const phone = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"), 160);
  const city = clean(formData.get("city"), 120);
  const message = clean(formData.get("message"), 4000);

  const category = clean(formData.get("category"), 30);
  const urgency = clean(formData.get("urgency"), 20) || "biasa";
  const contactPreference = clean(formData.get("contact_preference"), 20) || "whatsapp";

  /* ── Validasi ───────────────────────────────────────────────────────────── */
  const fieldErrors: Record<string, string> = {};

  if (!HELP_CATEGORIES.includes(category)) {
    fieldErrors.category = "Pilih jenis bantuan yang paling sesuai.";
  }
  if (!URGENCIES.includes(urgency)) fieldErrors.urgency = "Pilih tingkat urgensi.";
  if (!CONTACT_PREFS.includes(contactPreference)) {
    fieldErrors.contact_preference = "Pilih cara kami menghubungi Anda.";
  }
  if (message.length < 15) {
    fieldErrors.message = "Ceritakan sedikit lebih banyak (minimal 15 karakter) agar kami paham.";
  }
  if (!isAnonymous && name.length < 2) {
    fieldErrors.name = "Tulis nama Anda, atau centang opsi anonim di bawah.";
  }

  // Kalau minta dihubungi, harus ada satu jalur kontak yang bisa dipakai.
  if (contactPreference !== "tidak_perlu") {
    const needsPhone = contactPreference === "whatsapp" || contactPreference === "telepon";
    if (needsPhone && !/^[0-9+\-\s()]{8,}$/.test(phone)) {
      fieldErrors.phone = "Masukkan nomor yang bisa dihubungi (minimal 8 digit).";
    }
    if (contactPreference === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Masukkan alamat email yang valid.";
    }
  }

  if (Object.keys(fieldErrors).length) {
    return {
      status: "error",
      message: "Ada bagian yang perlu dilengkapi dulu.",
      fieldErrors,
    };
  }

  /* ── Simpan ─────────────────────────────────────────────────────────────── */
  const refCode = makeRefCode();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("help_requests")
      .insert({
        ref_code: refCode,
        name: isAnonymous ? null : name,
        is_anonymous: isAnonymous,
        phone: phone || null,
        email: email || null,
        city: city || null,
        category,
        urgency,
        message,
        contact_preference: contactPreference,
        is_confidential: isConfidential,
      })
      .select()
      .single();

    if (error) throw error;

    // Notifikasi tidak boleh menggagalkan submit — kegagalannya sudah dicatat
    // di dalam notifyNewHelpRequest.
    await notifyNewHelpRequest(data as HelpRequest);

    return {
      status: "success",
      refCode,
      message: "Permohonan Anda sudah kami terima.",
    };
  } catch (err) {
    console.error("[help] gagal menyimpan permohonan:", err);
    return {
      status: "error",
      message:
        "Maaf, permohonan gagal terkirim karena kendala teknis. Silakan coba lagi, atau hubungi kami langsung lewat WhatsApp.",
    };
  }
}

/* ── Form kontak biasa ────────────────────────────────────────────────────── */

export async function submitContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (clean(formData.get("website"))) return { status: "success" };

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 160);
  const phone = clean(formData.get("phone"), 30);
  const subject = clean(formData.get("subject"), 160);
  const message = clean(formData.get("message"), 4000);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Tulis nama Anda.";
  if (message.length < 10) fieldErrors.message = "Pesan terlalu singkat.";
  if (!email && !phone) {
    fieldErrors.email = "Isi email atau nomor telepon agar kami bisa membalas.";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Alamat email tidak valid.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Ada bagian yang perlu dilengkapi.", fieldErrors };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email: email || null,
      phone: phone || null,
      subject: subject || null,
      message,
    });
    if (error) throw error;

    return { status: "success", message: "Pesan Anda sudah terkirim. Terima kasih!" };
  } catch (err) {
    console.error("[contact] gagal menyimpan pesan:", err);
    return {
      status: "error",
      message: "Pesan gagal terkirim. Silakan coba lagi atau hubungi kami lewat WhatsApp.",
    };
  }
}
