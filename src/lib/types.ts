export type PostCategory = "renungan" | "artikel" | "berita" | "kesaksian";
export type HelpCategory = "doa" | "konseling" | "kebutuhan" | "kunjungan" | "keuangan" | "lainnya";
export type Urgency = "biasa" | "mendesak" | "darurat";
export type ContactPreference = "whatsapp" | "telepon" | "email" | "tidak_perlu";
export type HelpStatus = "baru" | "diproses" | "selesai" | "ditutup";
export type Platform = "instagram" | "tiktok" | "youtube";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  category: PostCategory;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Quote = {
  id: string;
  content: string;
  reference: string | null;
  author: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
};

export type JPEvent = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  address: string | null;
  map_url: string | null;
  cover_url: string | null;
  register_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  icon: string;
  schedule: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type SocialPost = {
  id: string;
  platform: Platform;
  url: string;
  caption: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type HelpRequest = {
  id: string;
  ref_code: string;
  name: string | null;
  is_anonymous: boolean;
  phone: string | null;
  email: string | null;
  city: string | null;
  category: HelpCategory;
  urgency: Urgency;
  message: string;
  contact_preference: ContactPreference;
  is_confidential: boolean;
  status: HelpStatus;
  handled_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

/* ── Label bahasa Indonesia untuk enum di atas ───────────────────────────── */
export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  renungan: "Renungan",
  artikel: "Artikel",
  berita: "Berita",
  kesaksian: "Kesaksian",
};

export const HELP_CATEGORY_LABEL: Record<HelpCategory, string> = {
  doa: "Didoakan",
  konseling: "Konseling & pendampingan",
  kebutuhan: "Kebutuhan pokok",
  kunjungan: "Kunjungan / dijenguk",
  keuangan: "Pergumulan keuangan",
  lainnya: "Lainnya",
};

export const HELP_CATEGORY_HINT: Record<HelpCategory, string> = {
  doa: "Ada beban yang ingin dibawa bersama dalam doa",
  konseling: "Ingin berbicara empat mata dengan pendamping",
  kebutuhan: "Sembako, obat, atau kebutuhan harian",
  kunjungan: "Sakit, berduka, atau ingin ditemani",
  keuangan: "Kesulitan biaya sekolah, kontrakan, atau usaha",
  lainnya: "Hal lain yang belum ada di daftar",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  biasa: "Bisa menunggu",
  mendesak: "Cukup mendesak",
  darurat: "Darurat",
};

export const CONTACT_PREF_LABEL: Record<ContactPreference, string> = {
  whatsapp: "WhatsApp",
  telepon: "Telepon",
  email: "Email",
  tidak_perlu: "Tidak perlu dihubungi",
};

export const HELP_STATUS_LABEL: Record<HelpStatus, string> = {
  baru: "Baru",
  diproses: "Sedang ditangani",
  selesai: "Selesai",
  ditutup: "Ditutup",
};
