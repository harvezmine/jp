/** Shared by browser and server so both give the same guidance. */
export const HELP_CATEGORIES = ["doa", "konseling", "kebutuhan", "kunjungan", "keuangan", "lainnya"] as const;
export const URGENCIES = ["biasa", "mendesak", "darurat"] as const;
export const CONTACT_PREFERENCES = ["whatsapp", "telepon", "email", "tidak_perlu"] as const;

export type HelpValues = {
  category: string;
  urgency: string;
  message: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  contactPreference: string;
  isAnonymous: boolean;
  isConfidential: boolean;
};

export type ContactValues = { name: string; phone: string; email: string; subject: string; message: string };

export function isValidPhone(value: string) {
  const text = value.trim();
  const digits = text.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(text) && digits.length >= 8 && digits.length <= 15;
}

export function isValidEmail(value: string) {
  return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateHelp(values: HelpValues, step?: number) {
  const errors: Record<string, string> = {};
  if (step === undefined || step === 0) {
    if (!(HELP_CATEGORIES as readonly string[]).includes(values.category))
      errors.category = "Pilih yang paling mendekati kebutuhanmu. Belum tahu juga tidak apa-apa.";
  }
  if (step === undefined || step === 1) {
    if (!(URGENCIES as readonly string[]).includes(values.urgency))
      errors.urgency = "Pilih kapan kamu membutuhkan dukungan.";
    if (values.message.trim().length < 15)
      errors.message = "Boleh tambahkan satu kalimat agar kami lebih memahami keadaanmu?";
    if (values.message.length > 4000) errors.message = "Ceritakan bagian utamanya dulu, maksimal 4.000 karakter.";
  }
  if (step === undefined || step === 2) {
    if (!values.isAnonymous && values.name.trim().length < 2)
      errors.name = "Nama panggilan boleh. Kalau belum nyaman, pilih bercerita tanpa nama.";
    if (!values.isAnonymous && values.name.length > 120)
      errors.name = "Gunakan nama yang lebih singkat, maksimal 120 karakter.";
    if (!(CONTACT_PREFERENCES as readonly string[]).includes(values.contactPreference))
      errors.contact_preference = "Pilih cara yang paling nyaman untuk dihubungi.";
    if (["whatsapp", "telepon"].includes(values.contactPreference) && !isValidPhone(values.phone))
      errors.phone = "Cek kembali nomornya, ya. Gunakan 8–15 angka, misalnya 081234567890.";
    if (values.contactPreference === "email" && !isValidEmail(values.email))
      errors.email = "Cek kembali alamat emailnya, misalnya nama@email.com.";
    if (values.city.length > 120) errors.city = "Cukup nama kota atau wilayahmu, maksimal 120 karakter.";
  }
  return errors;
}

export function validateContact(values: ContactValues) {
  const errors: Record<string, string> = {};
  if (values.name.trim().length < 2) errors.name = "Tulis nama yang nyaman kami gunakan untuk menyapamu.";
  if (values.name.length > 120) errors.name = "Gunakan nama yang lebih singkat, maksimal 120 karakter.";
  if (!values.email.trim() && !values.phone.trim())
    errors.email = "Isi salah satu: email atau nomor WhatsApp agar kami bisa membalas.";
  if (values.email.trim() && !isValidEmail(values.email))
    errors.email = "Cek kembali alamat emailnya, misalnya nama@email.com.";
  if (values.phone.trim() && !isValidPhone(values.phone))
    errors.phone = "Cek kembali nomornya, ya. Gunakan 8–15 angka.";
  if (values.message.trim().length < 10) errors.message = "Boleh tambahkan sedikit tentang yang ingin kamu sampaikan?";
  if (values.message.length > 4000) errors.message = "Tulis bagian utamanya dulu, maksimal 4.000 karakter.";
  if (values.subject.length > 160) errors.subject = "Ringkas topiknya menjadi maksimal 160 karakter.";
  return errors;
}

export function readHelpValues(formData: FormData): HelpValues {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const contactPreference = read("contact_preference") || "whatsapp";
  const isAnonymous = formData.get("is_anonymous") === "on";
  return {
    category: read("category"),
    urgency: read("urgency") || "biasa",
    message: read("message"),
    name: isAnonymous ? "" : read("name"),
    phone: ["whatsapp", "telepon"].includes(contactPreference) ? read("phone") : "",
    email: contactPreference === "email" ? read("email") : "",
    city: read("city"),
    contactPreference,
    isAnonymous,
    isConfidential: formData.get("is_confidential") === "on",
  };
}

export function readContactValues(formData: FormData): ContactValues {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    name: read("name"),
    email: read("email"),
    phone: read("phone"),
    subject: read("subject"),
    message: read("message"),
  };
}
