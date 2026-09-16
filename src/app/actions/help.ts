"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewHelpRequest } from "@/lib/notify";
import { makeRefCode } from "@/lib/utils";
import type { HelpRequest } from "@/lib/types";
import {
  helpDetails,
  readContactValues,
  readHelpValues,
  validateContact,
  validateHelp,
} from "@/lib/help-validation";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  refCode?: string;
  /** Error per field, dipakai untuk menandai input yang bermasalah. */
  fieldErrors?: Record<string, string>;
};

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
export async function submitHelpRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bot mengisi field tersembunyi ini, manusia tidak.
  if (clean(formData.get("website"))) {
    return { status: "success", refCode: makeRefCode() };
  }

  const values = readHelpValues(formData);
  const {
    isAnonymous,
    isConfidential,
    name,
    phone,
    email,
    city,
    message,
    category,
    urgency,
    contactPreference,
    source,
  } = values;
  const fieldErrors = validateHelp(values);
  // Formulir Ruang Doa memakai kata "pokok doa", bukan "cerita".
  const noun = source === "doa" ? "Pokok doamu" : "Ceritamu";

  if (Object.keys(fieldErrors).length) {
    return {
      status: "error",
      message: `Ada sedikit yang perlu dilengkapi. ${noun} tetap ada di sini.`,
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
        source,
        details: helpDetails(values),
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
      message: `Terima kasih. ${noun} sudah kami terima.`,
    };
  } catch (err) {
    console.error("[help] gagal menyimpan permohonan:", err);
    return {
      status: "error",
      message: `Maaf, ${noun.toLowerCase()} belum berhasil terkirim. Tulisanmu tetap ada di sini. Kamu bisa mencoba lagi atau menghubungi kami lewat halaman kontak.`,
    };
  }
}

/* ── Form kontak biasa ────────────────────────────────────────────────────── */

export async function submitContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  if (clean(formData.get("website"))) return { status: "success" };

  const { name, email, phone, subject, message } = readContactValues(formData);

  const fieldErrors = validateContact({ name, email, phone, subject, message });

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Ada sedikit yang perlu dilengkapi. Pesanmu tetap ada di sini.", fieldErrors };
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

    return { status: "success", message: "Terima kasih. Pesanmu sudah kami terima." };
  } catch (err) {
    console.error("[contact] gagal menyimpan pesan:", err);
    return {
      status: "error",
      message: "Maaf, pesanmu belum berhasil terkirim. Isianmu tetap tersimpan di halaman ini. Kamu bisa mencoba lagi.",
    };
  }
}
