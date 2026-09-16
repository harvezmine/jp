/** Shared by browser and server so both give the same guidance. Jangan import apa pun di file ini. */
export const HELP_CATEGORIES = ["doa", "konseling", "kebutuhan", "kunjungan", "keuangan", "lainnya"] as const;
export const URGENCIES = ["biasa", "mendesak", "darurat"] as const;
export const CONTACT_PREFERENCES = ["whatsapp", "telepon", "email", "tidak_perlu"] as const;
/** Asal formulir: umum (beranda, /pertolongan), Ruang Doa, atau Ruang Cerita. */
export const HELP_SOURCES = ["umum", "doa", "cerita"] as const;
export const PRAYER_FOR = ["diri_sendiri", "orang_lain"] as const;
export const COMPANIONS = ["siapa_saja", "perempuan", "laki_laki"] as const;

type Source = (typeof HELP_SOURCES)[number];

/** Kelompok isian. Setiap langkah formulir memvalidasi satu kelompok. */
export type HelpGroup = "kebutuhan" | "cerita" | "doa" | "kontak";

/** Urutan langkah per formulir. Formulir Doa dan Cerita tidak lagi menanyakan kebutuhan. */
export const HELP_FORM_STEPS: Record<Source, readonly HelpGroup[]> = {
  umum: ["kebutuhan", "cerita", "kontak"],
  doa: ["doa", "kontak"],
  cerita: ["cerita", "kontak"],
};

/** Kategori yang ditetapkan server untuk formulir khusus, apa pun isian dari browser. */
export const FIXED_CATEGORY: Partial<Record<Source, string>> = { doa: "doa", cerita: "konseling" };

/** Field error milik tiap kelompok, supaya formulir bisa kembali ke langkah yang tepat. */
export const HELP_GROUP_FIELDS: Record<HelpGroup, readonly string[]> = {
  kebutuhan: ["category"],
  cerita: ["urgency", "message", "companion"],
  doa: ["prayer_for", "message"],
  kontak: ["name", "contact_preference", "phone", "email", "city"],
};

export type HelpValues = {
  source: string;
  category: string;
  urgency: string;
  message: string;
  prayerFor: string;
  companion: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  contactPreference: string;
  isAnonymous: boolean;
  isConfidential: boolean;
};

export type ContactValues = { name: string; phone: string; email: string; subject: string; message: string };

const includes = (list: readonly string[], value: string) => list.includes(value);
const asSource = (value: string): Source => (includes(HELP_SOURCES, value) ? (value as Source) : "umum");

export function isValidPhone(value: string) {
  const text = value.trim();
  const digits = text.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(text) && digits.length >= 8 && digits.length <= 15;
}

export function isValidEmail(value: string) {
  return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Tanpa `group`: validasi semua kelompok milik formulir itu (dipakai server dan saat kirim). */
export function validateHelp(values: HelpValues, group?: HelpGroup) {
  const errors: Record<string, string> = {};
  if (!includes(HELP_SOURCES, values.source)) errors.source = "Formulir tidak dikenal. Coba muat ulang halaman, ya.";
  const source = asSource(values.source);
  const groups: readonly HelpGroup[] = group ? [group] : HELP_FORM_STEPS[source];

  const checkMessage = (min: number, tooShort: string) => {
    if (values.message.trim().length < min) errors.message = tooShort;
    if (values.message.length > 4000) errors.message = "Ceritakan bagian utamanya dulu, maksimal 4.000 karakter.";
  };

  if (!group || groups.includes("kebutuhan")) {
    if (!includes(HELP_CATEGORIES, values.category))
      errors.category = "Pilih yang paling mendekati kebutuhanmu. Belum tahu juga tidak apa-apa.";
  }
  if (groups.includes("cerita")) {
    if (!includes(URGENCIES, values.urgency)) errors.urgency = "Pilih kapan kamu membutuhkan dukungan.";
    checkMessage(15, "Boleh tambahkan satu kalimat agar kami lebih memahami keadaanmu?");
    if (source === "cerita" && !includes(COMPANIONS, values.companion))
      errors.companion = "Pilih pendamping yang membuatmu nyaman.";
  }
  if (groups.includes("doa")) {
    if (!includes(PRAYER_FOR, values.prayerFor)) errors.prayer_for = "Pilih doa ini untuk siapa.";
    checkMessage(10, "Tulis sedikit apa yang ingin didoakan, ya.");
  }
  if (groups.includes("kontak")) {
    if (!values.isAnonymous && values.name.trim().length < 2)
      errors.name = "Nama panggilan boleh. Kalau belum nyaman, pilih bercerita tanpa nama.";
    if (!values.isAnonymous && values.name.length > 120)
      errors.name = "Gunakan nama yang lebih singkat, maksimal 120 karakter.";
    if (!includes(CONTACT_PREFERENCES, values.contactPreference))
      errors.contact_preference = "Pilih cara yang paling nyaman untuk dihubungi.";
    if (["whatsapp", "telepon"].includes(values.contactPreference) && !isValidPhone(values.phone))
      errors.phone = "Cek kembali nomornya, ya. Gunakan 8–15 angka, misalnya 081234567890.";
    if (values.contactPreference === "email" && !isValidEmail(values.email))
      errors.email = "Cek kembali alamat emailnya, misalnya nama@email.com.";
    if (values.city.length > 120) errors.city = "Cukup nama kota atau wilayahmu, maksimal 120 karakter.";
  }
  return errors;
}

/** Indeks langkah pertama yang punya error. Error tanpa pemilik jatuh ke langkah terakhir. */
export function firstStepWithError(source: string, errors: Record<string, string>) {
  const steps = HELP_FORM_STEPS[asSource(source)];
  const index = steps.findIndex((g) => HELP_GROUP_FIELDS[g].some((key) => key in errors));
  return index === -1 ? steps.length - 1 : index;
}

/** Jawaban khusus formulir, disimpan di kolom help_requests.details. */
export function helpDetails(values: HelpValues): Record<string, string> {
  if (values.source === "doa") return { prayer_for: values.prayerFor };
  if (values.source === "cerita") return { companion: values.companion };
  return {};
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
  const source = asSource(read("source"));
  const contactPreference = read("contact_preference") || "whatsapp";
  const isAnonymous = formData.get("is_anonymous") === "on";
  return {
    source,
    category: FIXED_CATEGORY[source] ?? read("category"),
    // Formulir doa tidak menanyakan urgensi. Nomor krisis selalu tampil di sampingnya.
    urgency: source === "doa" ? "biasa" : read("urgency") || "biasa",
    message: read("message"),
    prayerFor: source === "doa" ? read("prayer_for") || "diri_sendiri" : "",
    companion: source === "cerita" ? read("companion") || "siapa_saja" : "",
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
