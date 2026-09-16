# Halaman per Ruang Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setiap Ruang (Pengharapan, Doa, Cerita, Belajar) punya halaman sendiri dengan section khususnya, termasuk formulir khusus Doa dan Cerita, dan beranda disusun berurutan per ruang dengan satu formulir umum di akhir.

**Architecture:** Empat route statis (`/ruang-pengharapan`, `/ruang-doa`, `/ruang-cerita`, `/ruang-belajar`) di `src/app/(site)/`, masing-masing menyusun section dari `src/components/sections/*`. `HelpForm` dipecah menjadi shell + field per langkah, dan menerima `source` (`umum` | `doa` | `cerita`) yang menentukan urutan langkah. Server memaksa kategori untuk formulir khusus dan menyimpan asal formulir serta jawaban khusus di dua kolom baru `help_requests.source` dan `help_requests.details`.

**Tech Stack:** Next.js 15 (App Router, server actions), React 19, Tailwind CSS v4, Supabase (Postgres self-host, migrasi lewat `deploy/migrate.sh`), `node --test` untuk validasi formulir.

---

## Konteks untuk yang mengerjakan

Baca ini dulu. Semua path relatif terhadap `jp/`.

- **Situs:** janjipengharapan.com, pelayanan untuk orang yang sedang berat hidupnya (datang dari TikTok/Instagram). JP berdiri sendiri. Every Nation Kelapa Gading hanya **mitra gereja**.
- **Aturan copy (wajib):**
  - Bahasa "kamu" yang santai, kalimat pendek, tanpa em dash (—).
  - Tanpa label kecil/eyebrow di atas judul hero.
  - Hindari pola "bukan X, tapi Y".
  - **Jangan menyebut jenis pergumulan** (sakit, keuangan, hubungan) di copy yang tampil.
  - Jangan menjanjikan bantuan materi.
  - Jangan pernah pakai kata "donasi" (sekarang "support").
- **Warna dan kelas yang sudah ada:**
  - Warna: `bg-cream`, `bg-paper`, `bg-maroon-950`, `bg-maroon-deep`, `bg-maroon-night`, `bg-sand-950`, `text-gold-400`, `text-maroon-700`, `text-sand-700`, `text-ink`.
  - Tipografi: `text-display`, `text-headline`, `text-title`, `text-lead`, `text-giant`, `font-display`.
  - Lainnya: `shadow-warm`, `shadow-warm-lg`, `shadow-deep`, `link-sweep`, `form-surface`, `bg-grain`.
- **Komponen yang dipakai ulang:**
  - Dari `@/components/ui`: `Container`, `ButtonLink` (prop `external`), `ArrowLink` (`tone: "maroon" | "light"`), `Rise`.
  - `Reveal` (`variant`: up/left/right/curtain/zoom, `as`, `delay`).
  - `Parallax` dan `ParallaxImage`.
  - `PageHero` dan `HeroLip`.
  - `FaqSection` (`title`, `description`, `action`, `items`, `className`).
  - `CrisisLine` (`tone`, `layout`).
  - `PostCard` (`variant`: default/feature/compact) dan `SocialCard`.
- **Data:**
  - `src/lib/ruang.ts` (4 ruang beserta programnya).
  - `src/lib/queries.ts`: `getPosts({ category, limit })`, `getQuotes`, `getSocialPosts`. `getSocialPosts` punya fallback reel asli.
  - `src/lib/site.ts`: `waLink(text)` dan `site`.
- **Migrasi database:**
  - File baru `supabase/migrations/<YYYYMMDDHHMMSS>_<nama>.sql`.
  - Jangan menulis `BEGIN`/`COMMIT`, dan jangan mengubah `schema.sql`.
  - `./deploy.sh` menjalankan migrasi **sebelum** build, jadi kolom baru harus aman untuk kode lama (pakai default).
- **Verifikasi:**
  - `npm run typecheck`, `npm run test:forms`.
  - Dev server JP berjalan di port 3001. **Jangan jalankan `next build` atau menghapus `.next` selama dev server hidup** (CSS jadi 404). Kalau perlu build, hentikan dev server dulu.
  - Supabase lokal tidak jalan. Query mengembalikan konten contoh saat development, dan submit formulir akan gagal dengan pesan error yang ramah (itu normal).
- **Commit:** pesan commit **tanpa** `Co-Authored-By` atau sebutan Claude (permintaan pemilik repo).

## Keputusan yang sudah diambil (dari pemilik)

1. **Halaman per ruang.**
   - Tiap ruang punya halaman lengkap. Form khusus Doa dan Cerita ada di halaman ruangnya.
   - Beranda berisi bab ringkas per ruang yang mengarah ke halaman itu, plus satu form umum di akhir.
2. **Isi Ruang Pengharapan** memakai tulisan kategori Renungan (fallback ke semua tulisan) dan video IG/TikTok yang sudah ada. Tidak ada kategori "Khotbah" baru.
3. **Komunitas di Ruang Belajar** memakai contoh dulu, ditandai `PLACEHOLDER`.

## Keputusan kecil yang diambil plan ini (boleh diubah pemilik)

- **Urutan bab di beranda:** Pengharapan → Doa → Cerita → Belajar. Menukar Doa dan Cerita cukup menukar urutan JSX di Task 11.
- **Formulir Doa** punya 2 langkah (Pokok doa, Kabar):
  - Tidak menanyakan urgensi (server mengisi `biasa`). Sebagai gantinya, nomor krisis selalu tampil di samping formulir.
  - Minimal 10 karakter.
  - Menanyakan "Doa ini untuk siapa?".
- **Formulir Cerita** punya 2 langkah (Ceritamu, Hubungi kamu):
  - Tetap menanyakan urgensi.
  - Menambah pilihan pendamping (siapa saja/perempuan/laki-laki). Kebutuhan ini sudah disebut di deskripsi Konseling pastoral.
- **Formulir umum** (beranda, `/pertolongan`) tetap 3 langkah seperti sekarang.
- **Tautan lama tetap bekerja:** `/pertolongan?category=doa` dan `?category=konseling` dialihkan ke form di halaman ruangnya.
- **Section Kutipan** pindah dari beranda ke halaman Ruang Pengharapan, supaya beranda tidak makin panjang.
- **`/layanan` tetap ada** sebagai halaman ringkasan (pintu empat ruang, jadwal mingguan, langkah, FAQ). Section besar per ruang pindah ke halaman masing-masing.

## Peta file

| File | Status | Tanggung jawab |
|---|---|---|
| `supabase/migrations/20260915120000_help_requests_source_details.sql` | Baru | Kolom `source` dan `details` |
| `src/lib/types.ts` | Ubah | Tipe dan label `HelpSource`, `PrayerFor`, `Companion` |
| `src/lib/help-validation.ts` | Ubah | Langkah per formulir, validasi per kelompok, kategori paksa, `helpDetails` |
| `tests/help-validation.test.mjs` | Ubah | Tes untuk semua perilaku di atas |
| `src/app/actions/help.ts` | Ubah | Simpan `source` dan `details` |
| `src/lib/notify.ts` | Ubah | Tampilkan asal formulir dan jawaban khusus |
| `src/app/admin/(panel)/permohonan/page.tsx`, `[id]/page.tsx` | Ubah | Badge asal formulir dan detail |
| `src/components/help-form-fields.tsx` | Baru | Fieldset per langkah (Kebutuhan, Cerita, Doa, Kontak) |
| `src/components/help-form.tsx` | Tulis ulang | Shell: state, stepper, submit, layar sukses |
| `src/lib/ruang.ts` | Ubah | `ruangHref`, `getRuang`, CTA ke form baru, program Belajar |
| `src/lib/komunitas.ts` | Baru | Data komunitas belajar (placeholder) |
| `src/lib/procon.ts` | Baru | Data ProCon (disalin dari ENKG) |
| `src/components/page-hero.tsx` | Ubah | Prop `lipClassName` |
| `src/components/ruang.tsx` | Ubah | Tautan ke halaman ruang, prop baru `RuangSection`, `ChapterHeading`, `RuangHero`, `RuangNav`, `RuangTiles` |
| `src/components/help-steps.tsx` | Ubah | Prop `ctaHref` |
| `src/components/sections/social-reels.tsx` | Baru (ekstrak dari beranda) | Video renungan |
| `src/components/sections/renungan.tsx` | Baru (ekstrak dari beranda) | Tulisan renungan |
| `src/components/sections/quotes.tsx` | Baru (ekstrak dari beranda) | Kutipan |
| `src/components/sections/cara-menemani.tsx` | Baru (ekstrak dari Tentang Kami) | Tiga nilai pendampingan |
| `src/components/sections/form-sections.tsx` | Baru | Section form Doa, Cerita, dan umum |
| `src/components/sections/komunitas.tsx` | Baru | Section komunitas belajar |
| `src/components/sections/procon.tsx` | Baru (port dari ENKG) | Section ProCon bergaya JP |
| `src/components/sections/belajar-chapter.tsx` | Baru | Bab Belajar di beranda |
| `src/app/(site)/ruang-pengharapan/page.tsx` dan tiga halaman ruang lain | Baru | Halaman per ruang |
| `src/app/(site)/page.tsx` | Ubah | Beranda disusun per bab |
| `src/app/(site)/tentang-kami/page.tsx` | Ubah | Pakai `CaraMenemani` |
| `src/app/(site)/layanan/page.tsx` | Ubah | Jadi ringkasan, tanpa `RuangSections` |
| `src/app/(site)/pertolongan/page.tsx` | Ubah | Alihkan kategori doa/konseling |
| `src/components/site-footer.tsx`, `site-header.tsx`, `src/app/sitemap.ts`, `README.md` | Ubah | Tautan, menu aktif, sitemap, dokumentasi |
| (di luar repo) `$TMPDIR/jp-shots/shot.mjs` | Sementara | Screenshot verifikasi 390px dan 1440px (Task 14) |

---

### Task 0: Amankan perubahan yang belum di-commit

Working tree masih berisi perubahan sesi sebelumnya (mitra gereja, section support).

- [ ] **Step 1: Cek isi perubahan**

Run: `git status --short`
Expected: berisi `README.md`, `src/app/(site)/donasi/page.tsx` (D), `src/components/donation.tsx` (D), `src/components/support.tsx` (??), dan beberapa file lain yang diubah.

- [ ] **Step 2: Pastikan tes lolos**

Run: `npm run typecheck && npm run test:forms`
Expected: typecheck tanpa error. Satu-satunya pengecualian adalah error di `.next/types/app/(site)/donasi/...`: itu tipe lama dari dev server. Kalau hanya itu yang muncul, lanjut saja. Tes: `# pass 23`, `# fail 0`.

- [ ] **Step 3: Commit**

```bash
git add -A README.md src docs
git commit -m "JP berdiri sendiri dengan mitra gereja, donasi jadi section support"
```

---

### Task 1: Migrasi database dan tipe

**Files:**
- Create: `supabase/migrations/20260915120000_help_requests_source_details.sql`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Tulis migrasi**

```sql
-- Asal formulir (umum, doa, cerita) dan jawaban khusus per formulir,
-- misalnya doa untuk siapa atau pendamping yang diinginkan.
-- Aman untuk kode lama: kedua kolom punya default, jadi insert lama tetap jalan.
alter table help_requests
  add column if not exists source text not null default 'umum'
    check (source in ('umum', 'doa', 'cerita')),
  add column if not exists details jsonb not null default '{}'::jsonb;
```

- [ ] **Step 2: Tambah tipe di `src/lib/types.ts`**

Tambahkan di bawah baris `export type Platform = ...`:

```ts
export type HelpSource = "umum" | "doa" | "cerita";
export type PrayerFor = "diri_sendiri" | "orang_lain";
export type Companion = "siapa_saja" | "perempuan" | "laki_laki";
/** Jawaban khusus formulir Doa dan Cerita (kolom help_requests.details). */
export type HelpDetails = { prayer_for?: PrayerFor; companion?: Companion };
```

Di `export type HelpRequest`, tambahkan dua field setelah `category: HelpCategory;`:

```ts
  source: HelpSource;
  details: HelpDetails;
```

Tambahkan label di bawah `HELP_CATEGORY_HINT`:

```ts
export const HELP_SOURCE_LABEL: Record<HelpSource, string> = {
  umum: "Formulir umum",
  doa: "Ruang Doa",
  cerita: "Ruang Cerita",
};

export const PRAYER_FOR_LABEL: Record<PrayerFor, string> = {
  diri_sendiri: "Diri sendiri",
  orang_lain: "Orang lain",
};

export const COMPANION_LABEL: Record<Companion, string> = {
  siapa_saja: "Siapa saja",
  perempuan: "Perempuan",
  laki_laki: "Laki-laki",
};
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS. Field baru belum dipakai, dan `HelpRequest` hanya dibaca dari database.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations src/lib/types.ts
git commit -m "Tambah kolom asal formulir dan detail di help_requests"
```

---

### Task 2: Validasi per formulir (TDD)

**Files:**
- Modify: `tests/help-validation.test.mjs`
- Modify: `src/lib/help-validation.ts`

`help-validation.ts` dipakai browser dan server, dan dites dengan men-transpile file itu **sendirian**. Karena itu file ini tidak boleh meng-import apa pun.

- [ ] **Step 1: Sesuaikan tes lama**

Di `tests/help-validation.test.mjs`, ganti baris import dinamis dengan:

```js
const {
  isValidPhone,
  validateHelp,
  validateContact,
  readHelpValues,
  readContactValues,
  helpDetails,
  firstStepWithError,
  HELP_FORM_STEPS,
} = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
```

Ganti objek `base` dengan:

```js
const base = {
  source: "umum",
  category: "doa",
  urgency: "biasa",
  message: "Saya ingin ditemani bercerita.",
  prayerFor: "",
  companion: "",
  name: "Rani",
  phone: "081234567890",
  email: "",
  city: "",
  contactPreference: "whatsapp",
  isAnonymous: false,
  isConfidential: true,
};
```

Ganti tes `"the first step validates only the selected need"` dengan:

```js
test("the need step validates only the selected need", () => {
  assert.deepEqual(validateHelp({ ...base, message: "", name: "", phone: "" }, "kebutuhan"), {});
  assert.ok(validateHelp({ ...base, category: "" }, "kebutuhan").category);
});
```

- [ ] **Step 2: Tambah tes baru di akhir file**

```js
const formOf = (entries) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(entries)) form.set(key, value);
  return form;
};

test("each form has its own steps", () => {
  assert.deepEqual([...HELP_FORM_STEPS.umum], ["kebutuhan", "cerita", "kontak"]);
  assert.deepEqual([...HELP_FORM_STEPS.doa], ["doa", "kontak"]);
  assert.deepEqual([...HELP_FORM_STEPS.cerita], ["cerita", "kontak"]);
});

test("the prayer form forces the doa category and ignores urgency", () => {
  const values = readHelpValues(
    formOf({
      source: "doa",
      category: "keuangan",
      urgency: "darurat",
      prayer_for: "orang_lain",
      message: "Doakan ibu saya, ya.",
      contact_preference: "tidak_perlu",
      is_anonymous: "on",
    }),
  );
  assert.equal(values.source, "doa");
  assert.equal(values.category, "doa");
  assert.equal(values.urgency, "biasa");
  assert.equal(values.prayerFor, "orang_lain");
  assert.equal(values.companion, "");
  assert.deepEqual(validateHelp(values), {});
  assert.deepEqual(helpDetails(values), { prayer_for: "orang_lain" });
});

test("the story form forces the konseling category and keeps urgency and companion", () => {
  const values = readHelpValues(
    formOf({
      source: "cerita",
      category: "doa",
      urgency: "mendesak",
      companion: "perempuan",
      message: "Saya ingin bercerita dengan seseorang.",
      name: "Rani",
      contact_preference: "whatsapp",
      phone: "081234567890",
    }),
  );
  assert.equal(values.category, "konseling");
  assert.equal(values.urgency, "mendesak");
  assert.equal(values.prayerFor, "");
  assert.deepEqual(validateHelp(values), {});
  assert.deepEqual(helpDetails(values), { companion: "perempuan" });
});

test("unknown sources fall back to the general form", () => {
  const values = readHelpValues(formOf({ source: "hack", category: "kunjungan", message: base.message }));
  assert.equal(values.source, "umum");
  assert.equal(values.category, "kunjungan");
  assert.deepEqual(helpDetails(values), {});
  assert.ok(validateHelp({ ...base, source: "hack" }).source);
});

test("prayer requests may be shorter than stories", () => {
  const doa = { ...base, source: "doa", category: "doa", prayerFor: "diri_sendiri" };
  assert.equal(validateHelp({ ...doa, message: "Doakan ibu" }).message, undefined);
  assert.ok(validateHelp({ ...doa, message: "Doakan" }).message);
  assert.ok(validateHelp({ ...base, message: "Doakan ibu" }).message);
});

test("each group reports only its own fields", () => {
  const doa = { ...base, source: "doa", category: "doa", prayerFor: "", message: "" };
  assert.deepEqual(Object.keys(validateHelp(doa, "doa")).sort(), ["message", "prayer_for"]);
  const cerita = { ...base, source: "cerita", category: "konseling", companion: "tamu" };
  assert.deepEqual(Object.keys(validateHelp(cerita, "cerita")), ["companion"]);
});

test("errors send the form back to the first step that owns them", () => {
  assert.equal(firstStepWithError("umum", { phone: "x" }), 2);
  assert.equal(firstStepWithError("umum", { category: "x", phone: "x" }), 0);
  assert.equal(firstStepWithError("doa", { prayer_for: "x" }), 0);
  assert.equal(firstStepWithError("cerita", { email: "x" }), 1);
  assert.equal(firstStepWithError("doa", { unknown: "x" }), 1);
});
```

- [ ] **Step 3: Jalankan tes, pastikan gagal**

Run: `npm run test:forms`
Expected: FAIL. `helpDetails is not a function` / `HELP_FORM_STEPS` undefined.

- [ ] **Step 4: Implementasi di `src/lib/help-validation.ts`**

Ganti bagian atas file, dari baris pertama sampai akhir fungsi `validateHelp`, dengan kode di bawah. `isValidPhone` dan `isValidEmail` tetap sama.

```ts
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
```

Lalu ganti fungsi `readHelpValues` dengan:

```ts
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
```

- [ ] **Step 5: Jalankan tes, pastikan lolos**

Run: `npm run test:forms`
Expected: `# pass 30`, `# fail 0`.

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: error hanya di `src/components/help-form.tsx`. Isinya: `HelpValues` butuh `source`/`prayerFor`/`companion`, dan argumen `validateHelp` berupa angka. Keduanya diperbaiki di Task 5, jadi lanjutkan.

- [ ] **Step 7: Commit**

```bash
git add tests/help-validation.test.mjs src/lib/help-validation.ts
git commit -m "Validasi formulir per asal: umum, doa, cerita"
```

---

### Task 3: Simpan asal formulir, notifikasi, dan admin

**Files:**
- Modify: `src/app/actions/help.ts`
- Modify: `src/lib/notify.ts`
- Modify: `src/app/admin/(panel)/permohonan/page.tsx`
- Modify: `src/app/admin/(panel)/permohonan/[id]/page.tsx`

- [ ] **Step 1: `src/app/actions/help.ts`**

Ganti baris import validasi:

```ts
import {
  helpDetails,
  readContactValues,
  readHelpValues,
  validateContact,
  validateHelp,
} from "@/lib/help-validation";
```

Ganti destructuring di `submitHelpRequest`:

```ts
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
```

Di objek `.insert({...})`, tambahkan dua baris setelah `category,`:

```ts
        source,
        details: helpDetails(values),
```

- [ ] **Step 2: `src/lib/notify.ts`**

Ganti import label:

```ts
import {
  COMPANION_LABEL,
  HELP_CATEGORY_LABEL,
  HELP_SOURCE_LABEL,
  PRAYER_FOR_LABEL,
  URGENCY_LABEL,
  type HelpRequest,
} from "@/lib/types";
```

Tambahkan helper di atas `function buildSummary`:

```ts
/** Asal formulir dan jawaban khusus Doa/Cerita, sebagai pasangan label dan nilai. */
function extraRows(req: HelpRequest): [string, string][] {
  const rows: [string, string][] = [["Formulir", HELP_SOURCE_LABEL[req.source] ?? HELP_SOURCE_LABEL.umum]];
  if (req.details?.prayer_for) rows.push(["Doa untuk", PRAYER_FOR_LABEL[req.details.prayer_for]]);
  if (req.details?.companion) rows.push(["Pendamping", COMPANION_LABEL[req.details.companion]]);
  return rows;
}
```

Di `buildSummary`, tepat setelah array `lines` dibuat (sebelum `if (req.city)`), tambahkan:

```ts
  for (const [label, value] of extraRows(req)) lines.push(`${label}: ${value}`);
```

Di `sendEmail`, tepat setelah baris `<tr>` Kategori, tambahkan:

```ts
        ${extraRows(req)
          .map(([label, value]) => `<tr><td style="padding:6px 0;color:#97765d">${label}</td><td>${value}</td></tr>`)
          .join("")}
```

- [ ] **Step 3: Daftar permohonan admin**

Di `src/app/admin/(panel)/permohonan/page.tsx`, tambahkan `HELP_SOURCE_LABEL` ke import dari `@/lib/types`. Lalu ganti:

```tsx
                      · {HELP_CATEGORY_LABEL[r.category]}
```

dengan:

```tsx
                      · {HELP_CATEGORY_LABEL[r.category]}
                      {r.source && r.source !== "umum" ? ` · ${HELP_SOURCE_LABEL[r.source]}` : ""}
```

- [ ] **Step 4: Detail permohonan admin**

Di `src/app/admin/(panel)/permohonan/[id]/page.tsx`, tambahkan `COMPANION_LABEL`, `HELP_SOURCE_LABEL`, dan `PRAYER_FOR_LABEL` ke import dari `@/lib/types`.

Setelah `<Badge tone="maroon">{HELP_CATEGORY_LABEL[r.category]}</Badge>`, tambahkan:

```tsx
              {r.source && r.source !== "umum" && <Badge tone="sand">{HELP_SOURCE_LABEL[r.source]}</Badge>}
```

Setelah blok `<div className="flex gap-3">` berisi "Ingin dihubungi", tambahkan:

```tsx
              {r.details?.prayer_for && (
                <div className="flex gap-3">
                  <dt className="w-32 shrink-0 text-sand-600">Doa untuk</dt>
                  <dd className="font-medium text-ink">{PRAYER_FOR_LABEL[r.details.prayer_for]}</dd>
                </div>
              )}
              {r.details?.companion && (
                <div className="flex gap-3">
                  <dt className="w-32 shrink-0 text-sand-600">Pendamping</dt>
                  <dd className="font-medium text-ink">{COMPANION_LABEL[r.details.companion]}</dd>
                </div>
              )}
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: error hanya di `src/components/help-form.tsx` (dikerjakan di Task 5).

- [ ] **Step 6: Commit**

```bash
git add src/app/actions/help.ts src/lib/notify.ts "src/app/admin/(panel)/permohonan"
git commit -m "Simpan dan tampilkan asal formulir di notifikasi dan admin"
```

---

### Task 4: Field formulir per langkah

**Files:**
- Create: `src/components/help-form-fields.tsx`

File ini memindahkan fieldset dari `help-form.tsx` supaya bisa disusun berbeda per formulir, lalu menambah `PrayerFields` dan pilihan pendamping.

- [ ] **Step 1: Buat file**

```tsx
"use client";

import { Checkbox, Field, Input, OptionCard, Textarea } from "@/components/form-fields";
import { Icon } from "@/components/icons";
import { crisis } from "@/lib/crisis";
import type { HelpValues } from "@/lib/help-validation";
import {
  COMPANION_LABEL,
  CONTACT_PREF_LABEL,
  HELP_CATEGORY_HINT,
  HELP_CATEGORY_LABEL,
  PRAYER_FOR_LABEL,
  URGENCY_LABEL,
  type Companion,
  type ContactPreference,
  type HelpCategory,
  type HelpSource,
  type PrayerFor,
  type Urgency,
} from "@/lib/types";

/**
 * Pilihan yang tampil di formulir umum. "kebutuhan" tetap sah di database supaya permintaan
 * lama masih terbaca di admin, tapi tidak ditawarkan lagi: dua pilihan soal ekonomi
 * terasa terlalu mengotak-ngotakkan, dan JP tidak menjanjikan bantuan materi.
 */
export const FORM_CATEGORIES: HelpCategory[] = ["doa", "konseling", "kunjungan", "keuangan", "lainnya"];

const categoryIcons: Record<HelpCategory, keyof typeof Icon> = {
  doa: "hands",
  konseling: "users",
  kebutuhan: "gift",
  kunjungan: "heart",
  keuangan: "shield",
  lainnya: "spark",
};

const urgencyHints: Record<Urgency, string> = {
  biasa: "Tidak ada kebutuhan segera",
  mendesak: "Ada yang perlu dibantu dalam waktu dekat",
  darurat: "Keselamatan sedang terancam",
};

export type StepProps = {
  values: HelpValues;
  errors: Record<string, string>;
  update: <K extends keyof HelpValues>(key: K, value: HelpValues[K]) => void;
  hidden: boolean;
  disabled: boolean;
};

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-700">
      {message}
    </p>
  );
}

function MessageField({
  values,
  errors,
  update,
  label,
  hint,
  placeholder,
  className,
}: Pick<StepProps, "values" | "errors" | "update"> & {
  label: string;
  hint: string;
  placeholder: string;
  className: string;
}) {
  return (
    <Field label={label} htmlFor="message" error={errors.message} hint={hint}>
      <Textarea
        id="message"
        name="message"
        value={values.message}
        onChange={(e) => update("message", e.target.value)}
        error={errors.message}
        aria-describedby="message-hint message-count"
        placeholder={placeholder}
        maxLength={4000}
        className={className}
      />
      <p id="message-count" className="mt-2 text-right text-xs tabular-nums text-sand-700">
        {values.message.length.toLocaleString("id-ID")} / 4.000 karakter
      </p>
    </Field>
  );
}

/* ── Langkah: kebutuhan (formulir umum saja) ──────────────────────────────── */

export function NeedFields({ values, errors, update, hidden, disabled }: StepProps) {
  return (
    <fieldset hidden={hidden} disabled={disabled} className="form-step space-y-5">
      <legend className="sr-only">Dukungan yang kamu butuhkan</legend>
      <div
        role="radiogroup"
        aria-label="Dukungan yang kamu butuhkan"
        aria-describedby={errors.category ? "category-error" : undefined}
        aria-invalid={Boolean(errors.category)}
        className="grid gap-3 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2"
      >
        {FORM_CATEGORIES.map((key) => {
          const CategoryIcon = Icon[categoryIcons[key]];
          return (
            <OptionCard
              key={key}
              name="category"
              value={key}
              checked={values.category === key}
              onChange={(value) => update("category", value)}
              title={HELP_CATEGORY_LABEL[key]}
              description={HELP_CATEGORY_HINT[key]}
              icon={<CategoryIcon className="h-4.5 w-4.5" />}
            />
          );
        })}
      </div>
      <FieldError id="category-error" message={errors.category} />
      <p className="rounded-xl bg-sand-100 p-4 text-xs leading-relaxed text-sand-700">
        Pilihan ini membantu tim memahami ceritamu. Bentuk bantuan akan dibicarakan bersama, sesuai kebutuhan dan
        ketersediaan.
      </p>
    </fieldset>
  );
}

/* ── Langkah: cerita (umum dan Ruang Cerita) ──────────────────────────────── */

export function StoryFields({
  values,
  errors,
  update,
  hidden,
  disabled,
  withCompanion,
}: StepProps & { withCompanion: boolean }) {
  return (
    <fieldset hidden={hidden} disabled={disabled} className="form-step space-y-6">
      <legend className="sr-only">Bagikan ceritamu</legend>
      <MessageField
        values={values}
        errors={errors}
        update={update}
        label="Yang ingin kamu ceritakan"
        hint="Satu atau dua kalimat untuk memulai juga boleh."
        placeholder="Akhir-akhir ini saya merasa… Saya berharap bisa…"
        className="min-h-48"
      />
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">Kapan kamu membutuhkan dukungan?</legend>
        <div className="grid gap-2.5">
          {(Object.keys(URGENCY_LABEL) as Urgency[]).map((key) => (
            <OptionCard
              key={key}
              name="urgency"
              value={key}
              checked={values.urgency === key}
              onChange={(value) => update("urgency", value)}
              title={URGENCY_LABEL[key]}
              description={urgencyHints[key]}
            />
          ))}
        </div>
        <FieldError message={errors.urgency} />
      </fieldset>
      {values.urgency === "darurat" && (
        <div
          role="note"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"
        >
          <strong>Utamakan keselamatanmu.</strong> Formulir ini tidak dipantau setiap saat. Kalau nyawamu atau orang
          lain sedang terancam, telepon{" "}
          <a href={crisis.emergency.href} className="font-semibold underline underline-offset-4">
            {crisis.emergency.label}
          </a>{" "}
          sekarang. Kalau butuh bicara, telepon {crisis.counseling.label} atau buka{" "}
          <a
            href={crisis.online.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            {crisis.online.label}
          </a>
          .
        </div>
      )}
      {withCompanion && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink">Pendamping yang membuatmu nyaman</legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {(Object.keys(COMPANION_LABEL) as Companion[]).map((key) => (
              <OptionCard
                key={key}
                name="companion"
                value={key}
                checked={values.companion === key}
                onChange={(value) => update("companion", value)}
                title={COMPANION_LABEL[key]}
              />
            ))}
          </div>
          <FieldError message={errors.companion} />
        </fieldset>
      )}
      <Checkbox
        name="is_confidential"
        checked={values.isConfidential}
        onChange={(value) => update("isConfidential", value)}
        title="Jaga isi ceritaku tetap pribadi"
        description="Tim hanya menerima pemberitahuan cerita baru tanpa isinya. Ceritamu tetap bisa dibaca oleh tim yang mendampingi."
      />
    </fieldset>
  );
}

/* ── Langkah: pokok doa (Ruang Doa) ───────────────────────────────────────── */

export function PrayerFields({ values, errors, update, hidden, disabled }: StepProps) {
  return (
    <fieldset hidden={hidden} disabled={disabled} className="form-step space-y-6">
      <legend className="sr-only">Pokok doa</legend>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">Doa ini untuk siapa?</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {(Object.keys(PRAYER_FOR_LABEL) as PrayerFor[]).map((key) => (
            <OptionCard
              key={key}
              name="prayer_for"
              value={key}
              checked={values.prayerFor === key}
              onChange={(value) => update("prayerFor", value)}
              title={PRAYER_FOR_LABEL[key]}
            />
          ))}
        </div>
        <FieldError message={errors.prayer_for} />
      </fieldset>
      {/* Hint sengaja terbuka: jangan menebak alasan orang minta didoakan. */}
      <MessageField
        values={values}
        errors={errors}
        update={update}
        label="Pokok doamu"
        hint="Tulis dengan kata-katamu sendiri. Satu kalimat pun cukup."
        placeholder="Tolong doakan…"
        className="min-h-40"
      />
      <Checkbox
        name="is_confidential"
        checked={values.isConfidential}
        onChange={(value) => update("isConfidential", value)}
        title="Hanya tim pendoa yang membaca"
        description="Tim menerima pemberitahuan pokok doa baru tanpa isinya, lalu membacanya di tempat yang terlindungi."
      />
    </fieldset>
  );
}

/* ── Langkah: kontak (semua formulir) ─────────────────────────────────────── */

export function ContactFields({
  values,
  errors,
  update,
  hidden,
  disabled,
  source,
}: StepProps & { source: HelpSource }) {
  const prayer = source === "doa";
  const summary = prayer
    ? { label: "Doa untuk", value: PRAYER_FOR_LABEL[values.prayerFor as PrayerFor] }
    : source === "cerita"
      ? { label: "Pendamping", value: COMPANION_LABEL[values.companion as Companion] }
      : { label: "Dukungan", value: HELP_CATEGORY_LABEL[values.category as HelpCategory] };

  return (
    <fieldset hidden={hidden} disabled={disabled} className="form-step space-y-6">
      <legend className="sr-only">Pilihan kontak dan ringkasan</legend>
      <Checkbox
        name="is_anonymous"
        checked={values.isAnonymous}
        onChange={(value) => update("isAnonymous", value)}
        title={prayer ? "Saya ingin mengirim tanpa nama" : "Saya ingin bercerita tanpa nama"}
        description="Namamu tidak disimpan. Jika memilih untuk dihubungi, kontakmu tetap diperlukan."
      />
      {!values.isAnonymous && (
        <Field label="Kami boleh memanggilmu siapa?" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
            autoComplete="name"
            maxLength={120}
            placeholder="Nama panggilan juga boleh"
          />
        </Field>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">
          {prayer ? "Mau dikabari lewat mana?" : "Cara yang nyaman untuk dihubungi"}
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {(Object.keys(CONTACT_PREF_LABEL) as ContactPreference[]).map((key) => (
            <OptionCard
              key={key}
              name="contact_preference"
              value={key}
              checked={values.contactPreference === key}
              onChange={(value) => update("contactPreference", value)}
              title={CONTACT_PREF_LABEL[key]}
            />
          ))}
        </div>
        <FieldError message={errors.contact_preference} />
      </fieldset>
      {["whatsapp", "telepon"].includes(values.contactPreference) && (
        <Field
          label={values.contactPreference === "whatsapp" ? "Nomor WhatsApp-mu" : "Nomor teleponmu"}
          htmlFor="phone"
          error={errors.phone}
          hint="Gunakan nomor yang bisa kamu akses sendiri."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
            aria-describedby="phone-hint"
            placeholder="Contoh: 081234567890"
            autoComplete="tel"
            maxLength={30}
          />
        </Field>
      )}
      {values.contactPreference === "email" && (
        <Field label="Alamat emailmu" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            placeholder="nama@email.com"
            autoComplete="email"
            maxLength={160}
          />
        </Field>
      )}
      {values.contactPreference === "tidak_perlu" && (
        <p className="rounded-xl bg-sand-100 p-4 text-sm leading-relaxed text-sand-700">
          {prayer
            ? "Pokok doamu tetap kami doakan tanpa menghubungimu. Nomor telepon dan email tidak ikut dikirim."
            : "Kami akan menerima ceritamu tanpa menghubungimu. Nomor telepon dan email tidak ikut dikirim."}
        </p>
      )}
      {!prayer && (
        <Field
          label="Kota atau wilayah"
          htmlFor="city"
          optional
          error={errors.city}
          hint="Boleh diisi jika kamu membutuhkan dukungan di dekatmu."
        >
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            error={errors.city}
            aria-describedby="city-hint"
            placeholder="Cukup kota atau wilayah, tanpa alamat lengkap"
            autoComplete="address-level2"
            maxLength={120}
          />
        </Field>
      )}
      <div className="rounded-2xl border border-sand-200 bg-sand-100/70 p-5">
        <p className="mb-3 text-sm font-semibold text-maroon-800">Sebelum kamu mengirim</p>
        <dl className="space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt className="text-sand-700">{summary.label}</dt>
            <dd className="font-medium text-ink">{summary.value}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt className="text-sand-700">Balasan melalui</dt>
            <dd className="font-medium text-ink">{CONTACT_PREF_LABEL[values.contactPreference as ContactPreference]}</dd>
          </div>
        </dl>
        <details className="mt-4 border-t border-sand-300/70 pt-3">
          <summary className="cursor-pointer text-sm font-semibold text-maroon-700">
            {prayer ? "Baca kembali pokok doamu" : "Baca kembali ceritamu"}
          </summary>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-sand-800">{values.message}</p>
        </details>
        <p className="mt-4 text-xs leading-relaxed text-sand-700">
          Dengan mengirim, kamu mengizinkan tim JP membaca {prayer ? "pokok doa" : "cerita"} dan menggunakan kontak
          sesuai pilihanmu untuk menindaklanjutinya.
        </p>
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 2: Typecheck file ini**

Run: `npm run typecheck 2>&1 | grep help-form-fields`
Expected: tidak ada output (file baru bersih). Error di `help-form.tsx` masih ada sampai Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/help-form-fields.tsx
git commit -m "Pisahkan field formulir per langkah, tambah field doa dan pendamping"
```

---

### Task 5: Shell `HelpForm` dengan `source`

**Files:**
- Modify (tulis ulang seluruhnya): `src/components/help-form.tsx`

Perilaku yang harus tetap sama:
- Honeypot `website`.
- Fokus dan scroll ke judul saat langkah berganti.
- Isian tidak hilang saat server mengembalikan error (dispatch manual).
- Nomor cerita di layar sukses.
- `initialCategory` untuk formulir umum.

- [ ] **Step 1: Tulis ulang file**

```tsx
"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";

import { submitHelpRequest, type FormState } from "@/app/actions/help";
import {
  ContactFields,
  FORM_CATEGORIES,
  NeedFields,
  PrayerFields,
  StoryFields,
  type StepProps,
} from "@/components/help-form-fields";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui";
import {
  FIXED_CATEGORY,
  HELP_FORM_STEPS,
  firstStepWithError,
  validateHelp,
  type HelpGroup,
  type HelpValues,
} from "@/lib/help-validation";
import { CONTACT_PREF_LABEL, type ContactPreference, type HelpCategory, type HelpSource } from "@/lib/types";
import { cn } from "@/lib/utils";

const initialState: FormState = { status: "idle" };

type StepCopy = { title: string; heading: string; hint: string };

const stepCopy: Record<HelpGroup, StepCopy> = {
  kebutuhan: {
    title: "Kebutuhanmu",
    heading: "Apa yang bisa kami bantu?",
    hint: "Pilih yang paling dekat dengan keadaanmu. Belum yakin juga tidak apa-apa.",
  },
  cerita: {
    title: "Ceritamu",
    heading: "Kami ingin mendengarkan.",
    hint: "Mulai dari bagian yang nyaman kamu bagikan. Tidak perlu menceritakan semuanya sekaligus.",
  },
  doa: {
    title: "Pokok doa",
    heading: "Apa yang ingin kami doakan?",
    hint: "Singkat pun tidak apa-apa. Kamu juga boleh mengirim tanpa nama.",
  },
  kontak: {
    title: "Hubungi kamu",
    heading: "Bagaimana kami bisa menyapamu?",
    hint: "Pilih cara yang nyaman. Kalau belum ingin dihubungi, kami tetap menerima ceritamu.",
  },
};

/** Formulir doa memakai kata yang lebih pas untuk langkah kontak. */
const prayerContactCopy: StepCopy = {
  title: "Kabar",
  heading: "Mau kami kabari?",
  hint: "Kalau belum ingin dihubungi, pokok doamu tetap kami doakan.",
};

/** Label tombol lanjut, menurut langkah berikutnya. */
const nextLabel: Record<HelpGroup, string> = {
  kebutuhan: "Lanjut",
  cerita: "Lanjut ke cerita",
  doa: "Lanjut",
  kontak: "Pilih cara dihubungi",
};

/** Nama field error yang berbeda dari nama state-nya. */
const errorKey: Partial<Record<keyof HelpValues, string>> = {
  contactPreference: "contact_preference",
  prayerFor: "prayer_for",
};

export function HelpForm({
  source = "umum",
  initialCategory,
}: {
  source?: HelpSource;
  /** Hanya untuk formulir umum. Formulir Doa dan Cerita memakai kategori tetap. */
  initialCategory?: HelpCategory;
}) {
  const [state, dispatch, pending] = useActionState(submitHelpRequest, initialState);
  const groups = HELP_FORM_STEPS[source];
  const lastStep = groups.length - 1;
  const prayer = source === "doa";
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<HelpValues>(() => ({
    source,
    category:
      FIXED_CATEGORY[source] ??
      (initialCategory && FORM_CATEGORIES.includes(initialCategory) ? initialCategory : ""),
    urgency: "biasa",
    message: "",
    prayerFor: prayer ? "diri_sendiri" : "",
    companion: source === "cerita" ? "siapa_saja" : "",
    name: "",
    phone: "",
    email: "",
    city: "",
    contactPreference: "whatsapp",
    isAnonymous: false,
    isConfidential: true,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showServerError, setShowServerError] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastPosition = useRef({ step, status: state.status });

  const update: StepProps["update"] = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[errorKey[key] ?? key];
      if (key === "contactPreference") {
        delete next.phone;
        delete next.email;
      }
      if (key === "isAnonymous") delete next.name;
      return next;
    });
    setShowServerError(false);
  };

  useEffect(() => {
    if (lastPosition.current.step === step && lastPosition.current.status === state.status) return;
    lastPosition.current = { step, status: state.status };
    headingRef.current?.focus({ preventScroll: true });
    topRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [step, state.status]);

  useEffect(() => {
    if (state.status !== "error") return;
    setErrors(state.fieldErrors ?? {});
    setShowServerError(true);
    if (state.fieldErrors) setStep(firstStepWithError(source, state.fieldErrors));
  }, [state, source]);

  const focusError = (next: Record<string, string>) => {
    requestAnimationFrame(() => {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  };
  const advance = () => {
    const next = validateHelp(values, groups[step]);
    setErrors(next);
    if (Object.keys(next).length) {
      focusError(next);
      return;
    }
    setStep((current) => Math.min(current + 1, lastStep));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    if (step < lastStep) {
      advance();
      return;
    }
    const next = validateHelp(values);
    setErrors(next);
    if (Object.keys(next).length) {
      setStep(firstStepWithError(source, next));
      focusError(next);
      return;
    }
    // Dispatch manual supaya React tidak mengosongkan isian saat server mengembalikan error.
    const data = new FormData(event.currentTarget);
    setShowServerError(false);
    startTransition(() => dispatch(data));
  };

  const copyFor = (group: HelpGroup) => (prayer && group === "kontak" ? prayerContactCopy : stepCopy[group]);

  if (state.status === "success") {
    const contacted = values.contactPreference !== "tidak_perlu";
    const via = CONTACT_PREF_LABEL[values.contactPreference as ContactPreference];
    const success = prayer
      ? {
          heading: "Pokok doamu sudah kami terima.",
          body: contacted
            ? `Tim pendoa akan mendoakannya dan mengabarimu melalui ${via}.`
            : "Tim pendoa akan mendoakannya. Sesuai pilihanmu, kami tidak akan menghubungimu.",
          code: "Nomor pokok doamu",
        }
      : {
          heading: "Terima kasih sudah bercerita.",
          body: contacted
            ? `Ceritamu sudah kami terima. Tim akan membacanya dan menghubungimu melalui ${via}. Kamu tidak perlu menunggu di halaman ini.`
            : "Ceritamu sudah kami terima. Sesuai pilihanmu, tim tidak akan menghubungimu. Jika nanti ingin berbicara, kamu boleh menghubungi kami kembali.",
          code: "Nomor ceritamu",
        };
    return (
      <div ref={topRef} className="scroll-mt-28 py-6 text-center" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-maroon-50 text-maroon-700 ring-1 ring-maroon-200">
          <Icon.check className="h-7 w-7" />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="font-display mt-6 text-3xl text-ink">
          {success.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-sand-700">{success.body}</p>
        {state.refCode && (
          <div className="mx-auto mt-7 max-w-xs rounded-2xl bg-paper p-5">
            <p className="text-xs text-sand-700">{success.code}</p>
            <p className="mt-2 text-2xl font-semibold tracking-wide text-maroon-700">{state.refCode}</p>
            <p className="mt-2 text-xs leading-relaxed text-sand-700">
              Simpan nomor ini jika ingin menanyakan kabar selanjutnya.
            </p>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="outline">
            Kembali ke beranda
          </ButtonLink>
          <ButtonLink href="/kontak">Hubungi tim JP</ButtonLink>
        </div>
      </div>
    );
  }

  const current = copyFor(groups[step]);
  const submitLabel = prayer ? "Kirim pokok doa" : "Kirim ceritaku";

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-sand-700">
        <span className="inline-flex items-center gap-2">
          <Icon.heart className="h-4 w-4 text-maroon-600" />
          Pelan-pelan saja, sesuai kesiapanmu.
        </span>
        <span className="shrink-0 tabular-nums">
          {step + 1} / {groups.length}
        </span>
      </div>
      <ol
        className={cn("mb-8 grid gap-3", groups.length === 2 ? "grid-cols-2" : "grid-cols-3")}
        aria-label="Langkah formulir"
      >
        {groups.map((group, index) => (
          <li key={group}>
            <button
              type="button"
              disabled={index > step || pending}
              onClick={() => {
                if (index < step) {
                  setStep(index);
                  setErrors({});
                  setShowServerError(false);
                }
              }}
              aria-current={index === step ? "step" : undefined}
              className="min-h-11 w-full text-left disabled:cursor-default"
            >
              <span
                className={cn(
                  "mb-2 block h-1 rounded-full transition-colors",
                  index <= step ? "bg-maroon-700" : "bg-sand-200",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold sm:text-sm",
                  index <= step ? "text-maroon-800" : "text-sand-700",
                )}
              >
                {index < step ? <Icon.check className="h-3 w-3" /> : `${index + 1}. `}
                {copyFor(group).title}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl leading-tight text-ink sm:text-3xl">
        {current.heading}
      </h2>
      <p className="mb-7 mt-3 text-sm leading-6 text-sand-700">{current.hint}</p>
      <noscript>
        <p className="mb-5 rounded-xl bg-maroon-50 p-4 text-sm">
          Aktifkan JavaScript untuk mengisi formulir ini, atau{" "}
          <a href="/kontak" className="underline">
            hubungi tim kami
          </a>
          .
        </p>
      </noscript>
      <form ref={formRef} onSubmit={submit} noValidate aria-busy={pending} className="space-y-6">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
        />
        <input type="hidden" name="source" value={source} />
        {groups.map((group, index) => {
          const props: StepProps = { values, errors, update, hidden: index !== step, disabled: pending };
          if (group === "kebutuhan") return <NeedFields key={group} {...props} />;
          if (group === "cerita") return <StoryFields key={group} {...props} withCompanion={source === "cerita"} />;
          if (group === "doa") return <PrayerFields key={group} {...props} />;
          return <ContactFields key={group} {...props} source={source} />;
        })}

        {showServerError && state.message && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800"
          >
            {state.message}{" "}
            <a href="/kontak" className="font-semibold underline underline-offset-4">
              Hubungi tim JP
            </a>
          </div>
        )}
        <div className="flex flex-col-reverse gap-3 border-t border-sand-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                setStep(step - 1);
                setErrors({});
                setShowServerError(false);
              }}
              className="w-full sm:w-auto"
            >
              <Icon.arrowLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < lastStep ? (
            <Button
              key="next"
              type="button"
              size="lg"
              onClick={(event) => {
                event.preventDefault();
                advance();
              }}
              className="w-full sm:w-auto"
            >
              {nextLabel[groups[step + 1]]}
              <Icon.arrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button key="submit" type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-sand-50/30 border-t-sand-50"
                  />
                  Sedang mengirim…
                </>
              ) : (
                <>
                  {submitLabel}
                  <Icon.arrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
        <p role="status" className="text-center text-xs leading-relaxed text-sand-700">
          {pending
            ? "Tunggu sebentar, ya. Sedang dikirim."
            : `${prayer ? "Pokok doamu" : "Ceritamu"} baru dikirim setelah kamu menekan “${submitLabel}”.`}
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck dan tes**

Run: `npm run typecheck && npm run test:forms`
Expected: typecheck bersih (kecuali sisa `.next/types/.../donasi` kalau masih ada), tes `# pass 30`.

- [ ] **Step 3: Cek formulir umum masih 3 langkah**

Run: `curl -s http://localhost:3001/pertolongan | grep -o "Lanjut ke cerita\|Kebutuhanmu\|Hubungi kamu" | sort -u`
Expected: ketiga teks muncul.

- [ ] **Step 4: Commit**

```bash
git add src/components/help-form.tsx
git commit -m "HelpForm menerima source: formulir umum, doa, dan cerita"
```

---

### Task 6: Data ruang, komunitas, dan ProCon

**Files:**
- Modify: `src/lib/ruang.ts`
- Create: `src/lib/komunitas.ts`
- Create: `src/lib/procon.ts`

- [ ] **Step 1: Helper di `src/lib/ruang.ts`**

Tambahkan setelah deklarasi `export const ruang: Ruang[] = [...]`:

```ts
/** Alamat halaman sebuah ruang, mis. "/ruang-doa". */
export const ruangHref = (slug: string) => `/${slug}`;

export function getRuang(slug: string): Ruang {
  const found = ruang.find((r) => r.slug === slug);
  if (!found) throw new Error(`Ruang tidak dikenal: ${slug}`);
  return found;
}
```

- [ ] **Step 2: Arahkan CTA ke formulir baru**

Di `src/lib/ruang.ts`:

- `cta: { label: "Saya ingin didoakan", href: "/pertolongan?category=doa" },` → `cta: { label: "Saya ingin didoakan", href: "/ruang-doa#kirim-doa" },`
- `cta: { label: "Saya ingin ditemani", href: "/pertolongan?category=konseling" },` → `cta: { label: "Saya ingin ditemani", href: "/ruang-cerita#ceritakan" },`

- [ ] **Step 3: Program dan CTA Ruang Belajar**

Ganti program `"Kursus Pengembangan Diri"` dengan:

```ts
      {
        title: "Komunitas belajar bersama",
        summary: "Kelompok kecil yang belajar hal praktis bareng, seperti AI untuk kerja dan bahasa Inggris.",
        when: "Sabtu, 10.00 WIB",
        format: "Online dan tatap muka",
        weekly: { day: 5, time: "10.00" },
      },
```

Ganti dua baris `cta` dan `secondary` Ruang Belajar dengan:

```ts
    cta: { label: "Lihat komunitas", href: "/ruang-belajar#komunitas" },
    secondary: { label: "Jadwal ProCon", href: "/ruang-belajar#procon" },
```

- [ ] **Step 4: Buat `src/lib/komunitas.ts`**

```ts
import { waLink } from "@/lib/site";

/**
 * Komunitas belajar bersama di Ruang Belajar.
 *
 * PLACEHOLDER: nama, isi, jadwal, dan format masih contoh. Ganti setelah dikonfirmasi tim JP.
 */
export type Komunitas = { slug: string; name: string; summary: string; when: string; format: string };

export const komunitas: Komunitas[] = [
  {
    slug: "ai-untuk-kerja",
    name: "AI untuk Kerja",
    summary: "Belajar memakai AI supaya pekerjaan sehari-hari terasa lebih ringan.",
    when: "Sabtu, 10.00 WIB",
    format: "Online",
  },
  {
    slug: "english-club",
    name: "English Club",
    summary: "Latihan ngobrol bahasa Inggris bareng. Salah sedikit tidak apa-apa.",
    when: "Selasa, 19.30 WIB",
    format: "Online",
  },
  {
    slug: "public-speaking",
    name: "Public Speaking",
    summary: "Berlatih bicara di depan orang, pelan-pelan dan saling menyemangati.",
    when: "Dua minggu sekali",
    format: "Tatap muka di Jakarta",
  },
];

export const komunitasWaLink = (name?: string) =>
  waLink(
    name
      ? `Halo, saya mau ikut komunitas ${name} di Ruang Belajar.`
      : "Halo, saya mau tanya soal komunitas di Ruang Belajar.",
  );
```

- [ ] **Step 5: Buat `src/lib/procon.ts`**

Data disalin dari `enkg/src/content/procon.ts`. Situs ENKG akan menautkan ke `/ruang-belajar#procon` (Task 13).

```ts
import { waLink } from "@/lib/site";

/**
 * ProCon: pertemuan dan kelas pengembangan diri di Ruang Belajar.
 *
 * PLACEHOLDER: event masih contoh (disalin dari situs ENKG). Ganti judul, tanggal,
 * dan link setelah jadwal resmi keluar. `date: null` tampil sebagai "Segera hadir".
 */
export const procon = {
  name: "ProCon",
  tagline: "Pertemuan dan jejaring untuk para profesional.",
  intro:
    "Kelas dan diskusi pengembangan diri untuk pelajar, mahasiswa, profesional, dan pemimpin yang ingin terus bertumbuh dalam pekerjaan dan kepemimpinan.",
  when: "Sebulan sekali",
  format: "Tatap muka di Jakarta",
} as const;

export type ProconEvent = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  /** yyyy-mm-dd, atau null bila jadwal belum diumumkan */
  date: string | null;
  partner?: string;
  href?: string;
};

export const proconEvents: ProconEvent[] = [
  {
    id: "monetize-with-ai",
    title: "Monetize with AI",
    topic: "Teknologi & karier",
    summary: "Memanfaatkan AI untuk bekerja lebih produktif dan membuka peluang baru.",
    date: null,
  },
  {
    id: "kelola-uang",
    title: "Mengelola Uang dengan Bijak",
    topic: "Keuangan pribadi",
    summary: "Mengatur arus kas, menabung, dan merencanakan keuangan pribadi maupun keluarga.",
    date: null,
    partner: "Bersama blu by BCA Digital",
  },
  {
    id: "c-level",
    title: "C-Level Leadership Class",
    topic: "Kepemimpinan",
    summary: "Kelas kepemimpinan untuk pemimpin tim, pemilik usaha, dan eksekutif.",
    date: null,
  },
];

export const proconWaLink = (title?: string) =>
  waLink(
    title
      ? `Halo, saya tertarik dengan ProCon (${title}). Boleh minta info jadwalnya?`
      : "Halo, saya tertarik dengan ProCon. Boleh minta info jadwalnya?",
  );
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/ruang.ts src/lib/komunitas.ts src/lib/procon.ts
git commit -m "Data halaman ruang, komunitas belajar, dan ProCon"
```

---

### Task 7: Komponen ruang: tautan ke halaman, hero, bab, navigasi

**Files:**
- Modify: `src/components/page-hero.tsx`
- Modify: `src/components/help-steps.tsx`
- Modify: `src/components/ruang.tsx`
- Modify: `src/app/(site)/page.tsx` (hanya hero dan pemanggilan `RuangIntro`)
- Modify: `src/app/(site)/layanan/page.tsx` (hapus `RuangSections`)

- [ ] **Step 1: `PageHero` menerima warna lip**

Di `src/components/page-hero.tsx`, tambahkan `lipClassName` ke props `PageHero`:

```tsx
  children,
  lipClassName,
}: {
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  /** Warna lengkung bawah. Samakan dengan latar section sesudah hero. */
  lipClassName?: string;
}) {
```

Ganti `<HeroLip />` di dalam `PageHero` dengan `<HeroLip className={lipClassName} />`.

- [ ] **Step 2: `HelpSteps` menerima tujuan tombol**

Di `src/components/help-steps.tsx`, ganti `export function HelpSteps() {` dengan:

```tsx
export function HelpSteps({ ctaHref = "/pertolongan" }: { ctaHref?: string }) {
```

Ganti `<ButtonLink href="/pertolongan" variant="light" size="lg">` dengan `<ButtonLink href={ctaHref} variant="light" size="lg">`.

- [ ] **Step 3: Import di `src/components/ruang.tsx`**

Ganti baris import `@/lib/ruang` dan tambah `PageHero`:

```tsx
import { PageHero } from "@/components/page-hero";
import { ruang as allRuang, ruangHref, weekDays, weeklyPrograms, type Ruang } from "@/lib/ruang";
```

- [ ] **Step 4: Kelas judul bersama**

Tambahkan tepat di bawah objek `tones`:

```tsx
/** Ukuran nama ruang sebagai judul besar (section ruang dan bab di beranda). */
const ruangTitleClass = "font-display text-[clamp(2.75rem,1.4rem+5vw,5.25rem)] font-semibold leading-[0.9] tracking-[-0.04em]";
```

- [ ] **Step 5: `RuangIntro` menautkan ke halaman ruang**

Di signature `RuangIntro`:
- Hapus `linkPrefix = "",` dari destructuring.
- Hapus `linkPrefix?: string;` dari tipe props.

Ganti:

```tsx
              <a id={linkPrefix ? r.slug : undefined} href={`${linkPrefix}#${r.slug}`} className="group block">
```

dengan:

```tsx
              {/* id menjaga tautan lama /layanan#ruang-doa tetap mendarat di kartu yang benar */}
              <a id={r.slug} href={ruangHref(r.slug)} className="group block">
```

- [ ] **Step 6: `RuangSection` bisa dipakai di halaman ruang dan beranda**

Ganti signature dan tiga baris pertama badan fungsi:

```tsx
export function RuangSection({ ruang: r, index }: { ruang: Ruang; index: number }) {
  const t = tones[r.tone];
  const flip = index % 2 === 1;
  const headingId = `${r.slug}-judul`;
```

dengan:

```tsx
export function RuangSection({
  ruang: r,
  index,
  id = `${r.slug}-program`,
  heading,
  showSummary = true,
  secondary = r.secondary,
}: {
  ruang: Ruang;
  index: number;
  id?: string;
  /** Default: nama ruang besar. Di halaman ruang, isi dengan tagline karena nama sudah ada di hero. */
  heading?: ReactNode;
  /** Matikan di halaman ruang: ringkasan sudah tampil di hero. */
  showSummary?: boolean;
  secondary?: { label: string; href: string };
}) {
  const t = tones[r.tone];
  const flip = index % 2 === 1;
  const headingId = `${id}-judul`;
```

Ganti `id={r.slug}` pada `<section>` milik `RuangSection` dengan `id={id}`, lalu tambah `scroll-mt-20` di awal `className` section itu.

Ganti blok `<h2 ...>` beserta isinya:

```tsx
              <h2
                id={headingId}
                className={cn(heading ? "text-display" : ruangTitleClass, t.title)}
              >
                {heading ?? (
                  <RuangName
                    name={r.name}
                    prefixClassName={cn("mb-3 text-[0.36em] tracking-normal", t.accent)}
                  />
                )}
              </h2>
```

Ganti `<Reveal delay={80}>` yang berisi `{r.summary}` dengan:

```tsx
            {showSummary && (
              <Reveal delay={80}>
                <p className={cn("text-lead mt-6 max-w-lg sm:mt-7", t.body)}>{r.summary}</p>
              </Reveal>
            )}
```

Di baris CTA, ganti `r.secondary.href` dan `r.secondary.label` dengan `secondary.href` dan `secondary.label`.

Hapus seluruh fungsi `RuangSections` (tidak dipakai lagi).

- [ ] **Step 7: `RuangSummary` menautkan ke halaman ruang**

- Hapus `linkPrefix = "",` dan `linkPrefix?: string;` (beserta komentarnya) dari `RuangSummary`.
- Ganti `href={`${linkPrefix}#${r.slug}`}` dengan `href={ruangHref(r.slug)}`.
- Ganti `href={`${linkPrefix}#${items[0].ruang.slug}`}` dengan `href={ruangHref(items[0].ruang.slug)}`.
- Ganti `href={`${linkPrefix}#${w.ruang.slug}`}` dengan `href={ruangHref(w.ruang.slug)}`.

- [ ] **Step 8: Komponen baru di akhir `src/components/ruang.tsx`**

```tsx
/* ── Hero halaman ruang ───────────────────────────────────────────────────── */

/** Hero tanpa foto: foto ruang sudah tampil besar di section program tepat di bawahnya. */
export function RuangHero({ ruang: r, action }: { ruang: Ruang; action: { label: string; href: string } }) {
  return (
    <PageHero
      lipClassName={tones[r.tone].section}
      title={<RuangName name={r.name} prefixClassName="mb-2 text-[0.42em] tracking-normal text-gold-400" />}
      description={r.summary}
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <ButtonLink href={action.href} variant="light" size="lg">
          {action.label}
          <Icon.arrowRight className="h-4 w-4" />
        </ButtonLink>
        <ArrowLink href={waLink(`Halo, saya mau tanya soal Ruang ${r.name}.`)} tone="light">
          {site.whatsapp ? "Tanya lewat WhatsApp" : "Hubungi tim JP"}
        </ArrowLink>
      </div>
    </PageHero>
  );
}

/* ── Pintasan empat ruang ─────────────────────────────────────────────────── */

export function RuangTiles({
  current,
  tone = "dark",
  className,
}: {
  current?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Ruang pelayanan" className={className}>
      <ul className="grid max-w-3xl grid-cols-2 gap-2.5 sm:gap-3 lg:max-w-[60rem] lg:grid-cols-4">
        {allRuang.map((r) => {
          const active = r.slug === current;
          const onDark = dark || active;
          return (
            <li key={r.slug}>
              <a
                href={ruangHref(r.slug)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-full items-center gap-2.5 rounded-2xl p-2 pr-2.5 transition duration-500 ease-out hover:-translate-y-0.5 sm:gap-3.5 sm:p-2.5 sm:pr-4",
                  dark
                    ? "hero-ruang-tile"
                    : active
                      ? "bg-maroon-700 shadow-warm"
                      : "bg-sand-100 ring-1 ring-sand-300/70 hover:bg-white hover:shadow-warm",
                )}
              >
                <span className="relative block h-12 w-8 shrink-0 overflow-hidden rounded-b-md rounded-t-full bg-maroon-900 sm:h-14 sm:w-10">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "font-display block text-xs italic leading-none",
                      onDark ? "text-gold-400" : "text-maroon-600",
                    )}
                  >
                    Ruang
                  </span>
                  <span
                    className={cn(
                      "font-display mt-1 block text-sm font-semibold leading-tight sm:text-lg",
                      onDark ? "text-sand-50" : "text-ink",
                    )}
                  >
                    {r.name}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 hidden text-xs leading-snug sm:block",
                      onDark ? "text-sand-200/70" : "text-sand-600",
                    )}
                  >
                    {active ? "Kamu di sini" : r.short}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── Penutup halaman ruang ────────────────────────────────────────────────── */

export function RuangNav({ current, className = "bg-cream" }: { current: string; className?: string }) {
  const index = allRuang.findIndex((r) => r.slug === current);
  const next = allRuang[(index + 1) % allRuang.length];
  return (
    <section aria-labelledby="ruang-lain-judul" className={cn("py-20 sm:py-28", className)}>
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 id="ruang-lain-judul" className="text-headline max-w-xl text-ink">
              Lanjut ke <span className="italic text-maroon-700">Ruang {next.name}.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <ArrowLink href="/layanan">Lihat semua ruang</ArrowLink>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <RuangTiles current={current} tone="light" className="mt-10 sm:mt-12" />
        </Reveal>
      </Container>
    </section>
  );
}

/* ── Judul bab di beranda ─────────────────────────────────────────────────── */

export function ChapterHeading({
  ruang: r,
  description,
  tone = "light",
  className,
}: {
  ruang: Ruang;
  description?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <Reveal className="lg:col-span-7">
        <h2 className={cn(ruangTitleClass, dark ? "text-sand-50" : "text-ink")}>
          <RuangName
            name={r.name}
            prefixClassName={cn("mb-3 text-[0.36em] tracking-normal", dark ? "text-gold-400" : "text-maroon-700")}
          />
        </h2>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-5">
        <p className={cn("text-lead max-w-md", dark ? "text-sand-200/80" : "text-sand-700")}>
          {description ?? r.summary}
        </p>
        <div className="mt-6">
          <ArrowLink href={ruangHref(r.slug)} tone={dark ? "light" : "maroon"}>
            Masuk ke Ruang {r.name}
          </ArrowLink>
        </div>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 9: Hero beranda memakai `RuangTiles`**

Di `src/app/(site)/page.tsx`:

- Ganti seluruh `<nav aria-label="Ruang pelayanan" ...>...</nav>` di dalam `<Rise delay={260}>` dengan `<RuangTiles className="mt-10 sm:mt-14" />`.
- Ganti `<RuangIntro linkPrefix="/layanan" />` dengan `<RuangIntro />`.
- Ubah import `{ RuangIntro }` menjadi `{ RuangIntro, RuangTiles }`.
- Hapus import `allRuang` dan `Image` kalau tidak dipakai lagi. `Image` masih dipakai `InlinePhoto` sampai Task 11, jadi biarkan kalau typecheck tidak mengeluh.

- [ ] **Step 10: `/layanan` tanpa `RuangSections`**

Di `src/app/(site)/layanan/page.tsx`:
- Ubah import menjadi `import { RuangIntro, RuangSummary } from "@/components/ruang";`.
- Hapus baris `<RuangSections />`.

- [ ] **Step 11: Typecheck dan cek tautan**

Run: `npm run typecheck`
Expected: PASS.

Run: `curl -s http://localhost:3001/ | grep -o 'href="/ruang-[a-z]*"' | sort | uniq -c`
Expected: keempat `/ruang-...` muncul (dari hero dan kartu ruang). Halamannya sendiri masih 404 sampai Task 10.

- [ ] **Step 12: Commit**

```bash
git add src/components/page-hero.tsx src/components/help-steps.tsx src/components/ruang.tsx "src/app/(site)/page.tsx" "src/app/(site)/layanan/page.tsx"
git commit -m "Komponen ruang menautkan ke halaman ruang, tambah hero, bab, dan navigasi ruang"
```

---

### Task 8: Section yang dipakai ulang di beranda dan halaman ruang

**Files:**
- Create: `src/components/sections/social-reels.tsx`
- Create: `src/components/sections/renungan.tsx`
- Create: `src/components/sections/quotes.tsx`
- Create: `src/components/sections/cara-menemani.tsx`
- Modify: `src/app/(site)/tentang-kami/page.tsx`

Kode diambil dari fungsi lokal `FromSocials`, `Reading`, dan `Quotes` di `src/app/(site)/page.tsx`, serta section "Cara kami menemani" di Tentang Kami. Beranda belum diubah di task ini. Fungsi lokalnya dihapus saat beranda ditulis ulang di Task 11.

- [ ] **Step 1: `src/components/sections/social-reels.tsx`**

```tsx
import { SocialCard } from "@/components/content-cards";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHeading } from "@/components/ruang";
import { Container } from "@/components/ui";
import type { Ruang } from "@/lib/ruang";
import { socialLinks } from "@/lib/site";
import type { SocialPost } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Video renungan pendek. Dengan `chapter`, judulnya menjadi judul bab di beranda. */
export function SocialReels({
  socials,
  chapter,
  id = "konten-sosmed",
}: {
  socials: SocialPost[];
  chapter?: Ruang;
  id?: string;
}) {
  if (!socials.length) return null;

  return (
    <section
      id={id}
      className="relative isolate scroll-mt-20 overflow-hidden bg-maroon-950 py-20 text-sand-50 sm:py-28 lg:py-40"
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-maroon-600/25 blur-[120px]"
      />

      <Container size="wide">
        {chapter ? (
          <ChapterHeading
            ruang={chapter}
            tone="dark"
            description="Renungan pendek yang kami bagikan setiap minggu. Tonton sebentar, lalu lanjut baca tulisannya."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <Reveal className="lg:col-span-7">
              <h2 className="text-display">
                Renungan <span className="italic text-gold-400">singkat</span> untuk harimu
              </h2>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5">
              <p className="text-lead max-w-sm text-sand-200/80">
                Doa dan renungan pendek yang kami bagikan setiap minggu di media sosial.
              </p>
              <div className="mt-6 flex gap-2">
                {socialLinks.map(({ key, href, label }) => {
                  const SocialIcon = Icon[key];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-sand-50/20 text-sand-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/70 hover:text-gold-400"
                    >
                      <SocialIcon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        )}

        {/* Di HP bisa digeser seperti feed; di layar lebar kolomnya berundak */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:scroll-px-0 sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-14">
          {socials.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 90}
              className={cn(
                "w-[68vw] max-w-72 shrink-0 snap-start sm:w-auto sm:max-w-none",
                i % 2 === 1 && "lg:translate-y-14",
              )}
            >
              <div className="rounded-[1.5rem] shadow-deep">
                <SocialCard post={s} />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: `src/components/sections/renungan.tsx`**

```tsx
import { PostCard } from "@/components/content-cards";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Satu tulisan besar dan dua tulisan ringkas, ditutup ajakan bercerita. */
export function RenunganSection({
  posts,
  title = "Bacaan untuk hari yang berat",
  storyHref = "#cerita",
  className = "bg-cream",
  id,
}: {
  posts: Post[];
  title?: string;
  /** Tujuan ajakan "Ceritakan ke kami" setelah membaca. */
  storyHref?: string;
  className?: string;
  id?: string;
}) {
  if (!posts.length) return null;
  const [first, ...rest] = posts;

  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="text-headline max-w-xl text-ink">{title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <ArrowLink href="/konten">Semua tulisan</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-12 sm:mt-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <PostCard post={first} variant="feature" />
          </Reveal>
          {rest.length > 0 && (
            <div className="flex flex-col gap-8 lg:col-span-5 lg:border-l lg:border-sand-300/70 lg:pl-14">
              {rest.slice(0, 2).map((p, i) => (
                <Reveal key={p.id} delay={(i + 1) * 100}>
                  <PostCard post={p} variant="compact" />
                </Reveal>
              ))}
              <Reveal delay={300}>
                <div className="relative overflow-hidden rounded-2xl bg-sand-100 p-6 shadow-warm">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-maroon-200/50 blur-2xl"
                  />
                  <p className="font-display relative text-lg leading-snug text-ink">
                    Masih ada yang mengganjal setelah membaca?
                  </p>
                  <div className="relative mt-4">
                    <ArrowLink href={storyHref}>Ceritakan ke kami</ArrowLink>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `src/components/sections/quotes.tsx`**

```tsx
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuotesSection({ quotes, className = "bg-cream" }: { quotes: Quote[]; className?: string }) {
  if (!quotes.length) return null;
  const [first, ...rest] = quotes;

  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        {/*
          Di layar lebar foto mengisi kolom kanan setinggi dua baris, dan kutipan pendek naik
          ke bawah ayat utama, supaya ayat yang pendek tidak meninggalkan ruang kosong.
        */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
          <div className="relative lg:col-span-8">
            <Parallax speed={-6} className="pointer-events-none absolute -left-2 -top-16 sm:-top-28 lg:-left-8">
              <span
                aria-hidden
                className="font-display block select-none text-[10rem] leading-none text-maroon-100 sm:text-[19rem]"
              >
                &ldquo;
              </span>
            </Parallax>
            <Reveal className="relative">
              <figure>
                <blockquote className="font-display text-[clamp(1.6rem,1rem+2.7vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-maroon-950">
                  {first.content}
                </blockquote>
                <figcaption className="font-display mt-6 text-lg italic text-maroon-700 sm:mt-7 sm:text-xl">
                  {first.reference ?? first.author}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-4 lg:row-span-2 lg:max-w-none lg:self-center">
            <Parallax
              speed={-3}
              className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-[1.75rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.quotes}
                alt="Seseorang duduk di ujung dermaga menghadap danau dan pegunungan"
                sizes="(min-width: 1024px) 30vw, 448px"
                strength={8}
                className="aspect-[4/3] rounded-[1.75rem] bg-sand-200 shadow-warm-lg lg:aspect-[3/4]"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            {rest.length > 0 && (
              <div className="grid gap-8 border-t border-sand-300/70 pt-10 sm:grid-cols-3">
                {rest.slice(0, 3).map((q, i) => (
                  <Reveal key={q.id} delay={i * 90}>
                    <figure>
                      <blockquote className="font-display text-lg leading-snug text-ink sm:text-base xl:text-lg">
                        &ldquo;{q.content}&rdquo;
                      </blockquote>
                      <figcaption className="mt-3 text-sm font-semibold text-maroon-700 sm:mt-4">
                        {q.reference ?? q.author}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
            <Reveal>
              <div className="mt-10 sm:mt-12">
                <ArrowLink href="/konten?tab=quotes">Semua kutipan</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: `src/components/sections/cara-menemani.tsx`**

```tsx
import { ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { values } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Tiga hal yang dipegang tim saat menemani. Dipakai di Tentang Kami dan Ruang Cerita. */
export function CaraMenemani({ className = "bg-paper" }: { className?: string }) {
  return (
    <section className={cn("overflow-clip py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">Cara kami menemani</h2>
                <p className="text-lead mt-5 text-sand-700 sm:mt-6">Tiga hal yang selalu kami pegang.</p>
              </Reveal>
              <Reveal variant="curtain" duration={1100} className="mt-12 hidden lg:block">
                <ParallaxImage
                  src={photos.aboutHands}
                  alt="Tangan terlipat berdoa di atas Alkitab yang terbuka"
                  sizes="38vw"
                  strength={8}
                  className="aspect-[4/3] rounded-[2rem] bg-sand-200 shadow-warm-lg"
                />
              </Reveal>
            </div>
          </div>

          <ol className="lg:col-span-7 lg:pt-4">
            {values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title}
                delay={i * 100}
                className="group relative border-t border-sand-300/70 py-9 first:border-t-0 first:pt-0 sm:py-12"
              >
                <span className="font-display block text-6xl font-semibold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-maroon-300)] group-hover:text-maroon-300 sm:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-5 text-3xl font-semibold text-ink sm:mt-6 sm:text-4xl">{v.title}</h3>
                <p className="text-lead mt-3 max-w-md text-sand-700 sm:mt-4">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Tentang Kami memakai `CaraMenemani`**

Di `src/app/(site)/tentang-kami/page.tsx`:
- Ganti seluruh blok dari komentar `{/* Cara kami menemani */}` sampai `</section>` penutupnya dengan `<CaraMenemani />`.
- Tambah import `import { CaraMenemani } from "@/components/sections/cara-menemani";`.
- Ubah `import { values, waLink } from "@/lib/site";` menjadi `import { waLink } from "@/lib/site";`.

- [ ] **Step 6: Typecheck dan cek halaman**

Run: `npm run typecheck`
Expected: PASS.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/tentang-kami && curl -s http://localhost:3001/tentang-kami | grep -c "Tiga hal yang selalu kami pegang"`
Expected: `200` lalu angka `1` atau lebih.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections "src/app/(site)/tentang-kami/page.tsx"
git commit -m "Pindahkan section video, renungan, kutipan, dan cara menemani ke komponen bersama"
```

---

### Task 9: Section baru: formulir, komunitas, ProCon, bab Belajar

**Files:**
- Create: `src/components/sections/form-sections.tsx`
- Create: `src/components/sections/komunitas.tsx`
- Create: `src/components/sections/procon.tsx`
- Create: `src/components/sections/belajar-chapter.tsx`

- [ ] **Step 1: `src/components/sections/form-sections.tsx`**

```tsx
import type { ReactNode } from "react";

import { CrisisLine } from "@/components/crisis-line";
import { HelpForm } from "@/components/help-form";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

function FormLayout({
  id,
  title,
  lead,
  aside,
  crisisOnMobile = false,
  className,
  children,
}: {
  id: string;
  title: ReactNode;
  lead: string;
  aside?: ReactNode;
  /** Formulir tanpa pertanyaan urgensi wajib menampilkan nomor krisis juga di HP. */
  crisisOnMobile?: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 overflow-clip py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">{title}</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-lead mt-5 max-w-sm text-sand-700">{lead}</p>
              </Reveal>
              {aside}
              <CrisisLine className="mt-10 hidden lg:block" />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="form-surface rounded-[1.75rem] p-5 sm:p-8 lg:p-10">{children}</div>
            {crisisOnMobile && <CrisisLine className="mt-6 lg:hidden" />}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Formulir khusus Ruang Doa. Tautan masuk: /ruang-doa#kirim-doa. */
export function PrayerFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="kirim-doa"
      className={className}
      crisisOnMobile
      title={
        <>
          Tulis <span className="italic text-maroon-700">pokok doamu.</span>
        </>
      }
      lead="Tim pendoa akan mendoakannya. Kamu boleh mengirim tanpa nama."
      aside={
        <Reveal delay={150}>
          <figure className="mt-8 rounded-2xl bg-sand-100 p-6">
            <blockquote className="font-display text-lg italic leading-snug text-maroon-900">
              &ldquo;Nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan
              syukur.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-maroon-600">Filipi 4:6</figcaption>
          </figure>
        </Reveal>
      }
    >
      <HelpForm source="doa" />
    </FormLayout>
  );
}

/** Formulir khusus Ruang Cerita. Tautan masuk: /ruang-cerita#ceritakan. */
export function StoryFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="ceritakan"
      className={className}
      title={
        <>
          Ceritakan <span className="italic text-maroon-700">pelan-pelan.</span>
        </>
      }
      lead="Tulis sebatas yang nyaman. Kamu juga bisa memilih pendamping perempuan atau laki-laki."
    >
      <HelpForm source="cerita" />
    </FormLayout>
  );
}

/** Formulir umum di akhir beranda, untuk yang belum tahu harus ke ruang mana. */
export function GeneralFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="cerita"
      className={className}
      title={
        <>
          Ceritakan <span className="italic text-maroon-700">di sini saja.</span>
        </>
      }
      lead="Belum tahu harus mulai dari ruang mana? Tulis saja di sini. Singkat pun tidak apa-apa."
    >
      <HelpForm />
    </FormLayout>
  );
}
```

- [ ] **Step 2: `src/components/sections/komunitas.tsx`**

```tsx
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { komunitas, komunitasWaLink } from "@/lib/komunitas";
import { cn } from "@/lib/utils";

const linkProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function KomunitasSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <section id="komunitas" className={cn("scroll-mt-20 overflow-clip py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">
                  Belajar <span className="italic text-maroon-700">bareng-bareng.</span>
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-lead mt-5 max-w-md text-sand-700">
                  Komunitas kecil untuk belajar hal praktis bersama. Siapa saja boleh ikut, termasuk yang baru mau
                  mencoba.
                </p>
              </Reveal>
              <Reveal delay={150}>
                <div className="mt-8">
                  <ButtonLink href={komunitasWaLink()} external>
                    <Icon.whatsapp className="h-4 w-4" />
                    Tanya soal komunitas
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {komunitas.map((k, i) => {
              const href = komunitasWaLink(k.name);
              return (
                <Reveal as="li" key={k.slug} delay={i * 90} className="border-b border-sand-300/70">
                  <a
                    href={href}
                    {...linkProps(href)}
                    className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-7 sm:py-9"
                  >
                    <span className="font-display text-2xl font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-3xl">
                      {k.name}
                    </span>
                    <span className="grid h-11 w-11 place-items-center self-start rounded-full border border-sand-300 text-maroon-700 transition-colors duration-300 group-hover:border-maroon-700 group-hover:bg-maroon-700 group-hover:text-sand-50">
                      <Icon.arrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="col-span-2 max-w-lg leading-relaxed text-sand-700">{k.summary}</span>
                    <span className="col-span-2 text-sm font-semibold text-maroon-700">
                      {k.when} <span className="font-normal text-sand-600">· {k.format}</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `src/components/sections/procon.tsx` (port dari ENKG, gaya JP)**

Perbedaan dari versi ENKG:
- Warna navy/kuning diganti `bg-sand-950` dan `bg-gold-400` dengan teks maroon.
- Tanpa eyebrow "ProCon News" dan tanpa kisi kertas grafik.
- Topik ditulis miring (`font-display italic`), bukan pill.
- WhatsApp memakai `proconWaLink`.

```tsx
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { procon, proconEvents, proconWaLink, type ProconEvent } from "@/lib/procon";
import { cn } from "@/lib/utils";

function formatIsoDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** Tombol kartu: detail di situs, link pendaftaran, atau WhatsApp bila belum ada keduanya. */
function cardAction(event: ProconEvent) {
  if (!event.href) return { href: proconWaLink(event.title), label: "Kabari saya", external: true };
  const internal = event.href.startsWith("/");
  return { href: event.href, label: internal ? "Lihat detail" : "Daftar", external: !internal };
}

/** Huruf besar samar di kartu utama: "AI" untuk event AI, selain itu huruf awal topiknya. */
function watermark(event: ProconEvent) {
  return /\bAI\b/.test(event.title) ? "AI" : event.topic.charAt(0).toUpperCase();
}

export function ProconSection({
  events = proconEvents,
  className,
}: {
  events?: ProconEvent[];
  className?: string;
}) {
  const shown = events.slice(0, 5);
  // Kartu utama setinggi dua baris hanya bila sisa kartunya genap, supaya kisi tetap rapi.
  const spanFeatured = shown.length % 2 === 1 && shown.length > 1;

  return (
    <section
      id="procon"
      className={cn(
        "relative isolate scroll-mt-20 overflow-hidden bg-sand-950 py-20 text-sand-50 sm:py-28 lg:py-36",
        className,
      )}
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold-400/10 blur-[120px]"
      />

      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display">
              ProCon, <span className="italic text-gold-400">iman dalam keseharian.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead text-sand-300/80">{procon.intro}</p>
            <p className="mt-5 text-sm font-semibold text-gold-400">
              {procon.when} <span className="font-normal text-sand-400">· {procon.format}</span>
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-2">
          {shown.map((event, index) => {
            const featured = index === 0;
            const action = cardAction(event);
            return (
              <Reveal
                as="li"
                key={event.id}
                delay={index * 90}
                className={cn(featured && spanFeatured && "lg:row-span-2")}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 transition duration-300 sm:p-9",
                    featured
                      ? "min-h-[22rem] bg-gold-400 text-maroon-950 shadow-deep"
                      : "bg-sand-50/[0.04] ring-1 ring-sand-50/10 hover:bg-sand-50/[0.07]",
                  )}
                >
                  {featured && (
                    <span
                      aria-hidden
                      className="font-display pointer-events-none absolute -right-4 top-16 select-none text-[16rem] font-semibold italic leading-none tracking-tighter text-maroon-950/10 sm:text-[20rem]"
                    >
                      {watermark(event)}
                    </span>
                  )}
                  <div className="relative flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className={cn("font-display text-lg italic", featured ? "text-maroon-900" : "text-gold-400")}>
                      {event.topic}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        featured ? "text-maroon-950/70" : "text-sand-300/70",
                      )}
                    >
                      <Icon.calendar className="h-4 w-4" />
                      {event.date ? formatIsoDate(event.date) : "Segera hadir"}
                    </span>
                  </div>

                  <div className="relative mt-auto pt-10 sm:pt-14">
                    <h3
                      className={cn(
                        "font-display text-balance font-semibold leading-tight tracking-tight",
                        featured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
                      )}
                    >
                      {event.title}
                    </h3>
                    {event.partner && (
                      <p className={cn("mt-2 font-semibold", featured ? "text-maroon-900" : "text-gold-400")}>
                        {event.partner}
                      </p>
                    )}
                    <p
                      className={cn(
                        "mt-3 max-w-md leading-relaxed",
                        featured ? "text-maroon-950/75" : "text-sand-300/75",
                      )}
                    >
                      {event.summary}
                    </p>
                    <a
                      href={action.href}
                      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={cn(
                        "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
                        featured ? "text-maroon-950" : "text-sand-50",
                      )}
                    >
                      <span className="link-sweep pb-0.5">{action.label}</span>
                      <Icon.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-8 flex flex-col gap-5 rounded-[1.75rem] bg-sand-50/[0.04] p-6 ring-1 ring-sand-50/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-xl text-sand-300/80">Jadwal ProCon diumumkan tiap bulan. Tanya jadwal terdekat lewat WhatsApp.</p>
          <ButtonLink href={proconWaLink()} external variant="light" className="shrink-0 self-start sm:self-auto">
            <Icon.whatsapp className="h-4 w-4" />
            Tanya jadwal ProCon
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: `src/components/sections/belajar-chapter.tsx`**

```tsx
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHeading } from "@/components/ruang";
import { Container } from "@/components/ui";
import { komunitas } from "@/lib/komunitas";
import { procon } from "@/lib/procon";
import { getRuang, ruangHref } from "@/lib/ruang";
import { cn } from "@/lib/utils";

/** Bab Ruang Belajar di beranda: daftar komunitas dan satu kartu ProCon. */
export function BelajarChapter({ className = "bg-paper" }: { className?: string }) {
  const r = getRuang("ruang-belajar");
  const href = ruangHref(r.slug);

  return (
    <section id="bab-belajar" className={cn("relative scroll-mt-20 overflow-hidden py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <ChapterHeading ruang={r} />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {komunitas.map((k, i) => (
              <Reveal as="li" key={k.slug} delay={i * 80} className="border-b border-sand-300/70">
                <a
                  href={`${href}#komunitas`}
                  className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-6 sm:py-6"
                >
                  <span className="font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-2xl">
                    {k.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-maroon-700">{k.when}</span>
                  <span className="text-sand-700 sm:col-span-2">{k.summary}</span>
                </a>
              </Reveal>
            ))}
          </ol>

          <Reveal variant="right" className="lg:col-span-5">
            <a
              href={`${href}#procon`}
              className="group relative isolate flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-sand-950 p-7 text-sand-50 shadow-deep sm:p-9"
            >
              <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
              <p className="text-sm font-semibold text-gold-400">
                {procon.when} <span className="font-normal text-sand-400">· {procon.format}</span>
              </p>
              <div className="mt-10">
                <h3 className="font-display text-4xl font-semibold sm:text-5xl">{procon.name}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-sand-300/80">{procon.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                  Lihat jadwal ProCon
                  <Icon.arrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: PASS. Section belum dipakai halaman mana pun sampai Task 10–11.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections
git commit -m "Section formulir ruang, komunitas belajar, ProCon, dan bab Belajar"
```

---

### Task 10: Empat halaman ruang

**Files:**
- Create: `src/app/(site)/ruang-pengharapan/page.tsx`
- Create: `src/app/(site)/ruang-doa/page.tsx`
- Create: `src/app/(site)/ruang-cerita/page.tsx`
- Create: `src/app/(site)/ruang-belajar/page.tsx`

Warna latar harus selang-seling, dan lengkung hero mengikuti tone section berikutnya (sudah diatur `RuangHero`).

- [ ] **Step 1: `src/app/(site)/ruang-pengharapan/page.tsx`**

```tsx
import type { Metadata } from "next";

import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { QuotesSection } from "@/components/sections/quotes";
import { RenunganSection } from "@/components/sections/renungan";
import { SocialReels } from "@/components/sections/social-reels";
import { getPosts, getQuotes, getSocialPosts } from "@/lib/queries";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Pengharapan",
  description: "Renungan pendek, tulisan, dan video untuk menguatkan harimu. Gratis dan terbuka untuk siapa saja.",
  alternates: { canonical: "/ruang-pengharapan" },
};

export default async function RuangPengharapanPage() {
  const r = getRuang("ruang-pengharapan");
  const [renungan, quotes, socials] = await Promise.all([
    getPosts({ category: "renungan", limit: 3 }),
    getQuotes({ limit: 4, featuredOnly: true }),
    getSocialPosts({ limit: 4 }),
  ]);
  // Belum ada renungan? Tampilkan tulisan terbaru apa pun supaya section tidak kosong.
  const posts = renungan.length ? renungan : await getPosts({ limit: 3 });

  return (
    <>
      <RuangHero
        ruang={r}
        action={
          posts.length
            ? { label: "Baca renungan", href: "#renungan" }
            : { label: "Tonton renungan", href: "#konten-sosmed" }
        }
      />
      {/* cream */}
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <RenunganSection id="renungan" posts={posts} storyHref="/ruang-cerita#ceritakan" className="bg-paper" />
      <SocialReels socials={socials} />
      <QuotesSection quotes={quotes} className="bg-cream" />
      <RuangNav current={r.slug} className="bg-paper" />
    </>
  );
}
```

- [ ] **Step 2: `src/app/(site)/ruang-doa/page.tsx`**

```tsx
import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { PrayerFormSection } from "@/components/sections/form-sections";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Doa",
  description: "Kirim pokok doamu, boleh tanpa nama. Tim pendoa Janji Pengharapan akan mendoakannya.",
  alternates: { canonical: "/ruang-doa" },
};

const faqs: Faq[] = [
  { q: "Harus menyebut nama?", a: "Tidak. Kamu boleh mengirim pokok doa tanpa nama." },
  { q: "Siapa yang mendoakan?", a: "Tim pendoa Janji Pengharapan. Isinya hanya dibaca tim yang menanganinya." },
  {
    q: "Boleh untuk orang lain?",
    a: "Boleh. Pilih \"Orang lain\" di formulir, lalu tulis singkat siapa yang ingin didoakan.",
  },
  {
    q: "Bagaimana ikut Doa Kesembuhan?",
    a: "Setiap Rabu pukul 19.30 WIB lewat Zoom, kamera boleh mati. Minta link-nya lewat WhatsApp.",
  },
  {
    q: "Kalau keadaanku darurat?",
    a: "Formulir ini tidak dipantau setiap saat. Kalau nyawamu atau orang lain terancam, telepon 119. Kalau butuh bicara sekarang, telepon 119 lalu tekan 8, atau buka healing119.id.",
  },
];

export default function RuangDoaPage() {
  const r = getRuang("ruang-doa");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Kirim pokok doa", href: "#kirim-doa" }} />
      {/* night */}
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <PrayerFormSection className="bg-cream" />
      <FaqSection
        title="Tentang Ruang Doa"
        description="Yang sering ditanyakan sebelum mengirim pokok doa."
        action={r.secondary}
        items={faqs}
        className="bg-paper"
      />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
```

- [ ] **Step 3: `src/app/(site)/ruang-cerita/page.tsx`**

```tsx
import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { HelpSteps } from "@/components/help-steps";
import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { CaraMenemani } from "@/components/sections/cara-menemani";
import { StoryFormSection } from "@/components/sections/form-sections";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Cerita",
  description: "Bercerita dan didampingi secara pribadi atau dalam kelompok kecil. Gratis dan boleh tanpa nama.",
  alternates: { canonical: "/ruang-cerita" },
};

const faqs: Faq[] = [
  {
    q: "Dengan siapa aku bercerita?",
    a: "Dengan pendamping rohani dari tim JP. Kamu boleh memilih pendamping perempuan atau laki-laki.",
  },
  { q: "Harus tatap muka?", a: "Tidak. Bisa online atau tatap muka, pilih yang paling nyaman." },
  { q: "Siapa yang membaca ceritaku?", a: "Hanya tim yang menanganinya. Boleh juga tanpa nama." },
  { q: "Benar-benar gratis?", a: "Ya. Pendampingan dan kelompok berbagi tidak dipungut biaya." },
  {
    q: "Kalau keadaanku darurat?",
    a: "Formulir ini tidak dipantau setiap saat. Kalau nyawamu atau orang lain terancam, telepon 119. Kalau butuh bicara sekarang, telepon 119 lalu tekan 8, atau buka healing119.id.",
  },
];

export default function RuangCeritaPage() {
  const r = getRuang("ruang-cerita");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Mulai bercerita", href: "#ceritakan" }} />
      {/* paper */}
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <CaraMenemani className="bg-cream" />
      <HelpSteps ctaHref="#ceritakan" />
      <StoryFormSection className="bg-cream" />
      <FaqSection
        title="Tentang Ruang Cerita"
        description="Wajar kalau masih ada yang ingin kamu ketahui sebelum mulai."
        action={r.secondary}
        items={faqs}
        className="bg-paper"
      />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
```

- [ ] **Step 4: `src/app/(site)/ruang-belajar/page.tsx`**

```tsx
import type { Metadata } from "next";

import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { KomunitasSection } from "@/components/sections/komunitas";
import { ProconSection } from "@/components/sections/procon";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Belajar",
  description: "Komunitas belajar bersama dan ProCon, untuk kamu yang ingin terus bertumbuh.",
  alternates: { canonical: "/ruang-belajar" },
};

export default function RuangBelajarPage() {
  const r = getRuang("ruang-belajar");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Lihat komunitas", href: "#komunitas" }} />
      {/* ink */}
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <KomunitasSection className="bg-cream" />
      <ProconSection />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Cek isi tiap halaman**

```bash
for p in ruang-pengharapan ruang-doa ruang-cerita ruang-belajar; do
  printf "%s " $p; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/$p
done
curl -s http://localhost:3001/ruang-doa | grep -o "Apa yang ingin kami doakan?\|Kebutuhanmu\|Filipi 4:6" | sort | uniq -c
curl -s http://localhost:3001/ruang-cerita | grep -o "Pendamping yang membuatmu nyaman\|Kebutuhanmu\|Tiga hal yang selalu kami pegang" | sort | uniq -c
curl -s http://localhost:3001/ruang-belajar | grep -o "English Club\|iman dalam keseharian\|Monetize with AI" | sort | uniq -c
curl -s http://localhost:3001/ruang-pengharapan | grep -o "Bacaan untuk hari yang berat\|Semua kutipan\|Lanjut ke" | sort | uniq -c
```

Expected:
- Keempat halaman `200`.
- `/ruang-doa` memuat "Apa yang ingin kami doakan?" dan "Filipi 4:6", tanpa "Kebutuhanmu".
- `/ruang-cerita` memuat "Pendamping yang membuatmu nyaman" dan "Tiga hal yang selalu kami pegang", tanpa "Kebutuhanmu".
- `/ruang-belajar` memuat ketiga teks.
- `/ruang-pengharapan` memuat "Semua kutipan" dan "Lanjut ke". "Bacaan untuk hari yang berat" muncul kalau ada tulisan; dengan konten contoh dev pasti ada.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(site)/ruang-pengharapan" "src/app/(site)/ruang-doa" "src/app/(site)/ruang-cerita" "src/app/(site)/ruang-belajar"
git commit -m "Halaman Ruang Pengharapan, Doa, Cerita, dan Belajar"
```

---

### Task 11: Beranda disusun per bab ruang

**Files:**
- Modify (tulis ulang seluruhnya): `src/app/(site)/page.tsx`

Urutan dan warna latar (selang-seling gelap/terang):

| # | Section | Latar |
|---|---|---|
| 1 | Hero | gelap |
| 2 | Pilih ruang | cream |
| 3 | Bab Pengharapan: video | gelap |
| 4 | Bab Pengharapan: renungan | paper |
| 5 | Bab Doa | night |
| 6 | Bab Cerita | cream |
| 7 | Satu langkah kecil | gelap |
| 8 | Bab Belajar | paper |
| 9 | Formulir umum | cream |
| 10 | Support | paper |

Mau Cerita sebelum Doa? Tukar section 5 dengan section 6–7, lalu cek lagi selang-seling warnanya.

- [ ] **Step 1: Tulis ulang file**

```tsx
import Image from "next/image";

import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { HeroLip } from "@/components/page-hero";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ChapterHeading, RuangIntro, RuangSection, RuangTiles } from "@/components/ruang";
import { BelajarChapter } from "@/components/sections/belajar-chapter";
import { GeneralFormSection } from "@/components/sections/form-sections";
import { RenunganSection } from "@/components/sections/renungan";
import { SocialReels } from "@/components/sections/social-reels";
import { SupportSection } from "@/components/support";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { getPosts, getSocialPosts } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { getRuang } from "@/lib/ruang";
import { values } from "@/lib/site";

export default async function HomePage() {
  const [renungan, socials] = await Promise.all([
    getPosts({ category: "renungan", limit: 3 }),
    getSocialPosts({ limit: 4 }),
  ]);
  const posts = renungan.length ? renungan : await getPosts({ limit: 3 });

  return (
    <>
      <Hero />
      <RuangIntro />

      {/* 01 Ruang Pengharapan */}
      <SocialReels socials={socials} chapter={getRuang("ruang-pengharapan")} id="bab-pengharapan" />
      <RenunganSection posts={posts} className="bg-paper" />

      {/* 02 Ruang Doa */}
      <RuangSection
        ruang={getRuang("ruang-doa")}
        index={1}
        id="bab-doa"
        secondary={{ label: "Masuk ke Ruang Doa", href: "/ruang-doa" }}
      />

      {/* 03 Ruang Cerita */}
      <CeritaChapter />
      <HelpSteps ctaHref="/ruang-cerita#ceritakan" />

      {/* 04 Ruang Belajar */}
      <BelajarChapter className="bg-paper" />

      <GeneralFormSection className="bg-cream" />
      <SupportSection className="bg-paper" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="jp-home-hero relative isolate overflow-hidden bg-maroon-950 text-sand-50">
      <ParallaxImage
        src={photos.hero}
        alt="Cahaya matahari di atas perbukitan"
        priority
        cover
        strength={5}
        className="-z-20"
        imageClassName="animate-settle"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/95 via-maroon-950/75 to-maroon-950/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon-950/85 via-maroon-950/10 to-maroon-950/20"
      />
      {/*
        Dibuat ringkas untuk orang yang membuka dari HP dalam keadaan lelah: judul, satu
        kalimat, satu tombol, lalu empat Ruang. Semuanya muat di layar pertama ponsel.
      */}
      <Container
        size="wide"
        className="relative flex flex-col justify-center pb-20 pt-28 sm:pb-24 sm:pt-36 lg:min-h-[min(100svh,58rem)] lg:pb-28 lg:pt-40"
      >
        <Rise>
          <h1 className="jp-hero-heading max-w-3xl">
            Kamu tidak harus
            <br />
            melewati ini <span className="italic text-gold-400">sendirian.</span>
          </h1>
        </Rise>
        <Rise delay={100}>
          <p className="mt-5 max-w-md text-base leading-7 text-sand-100/85 sm:mt-7 sm:text-lg sm:leading-8">
            Apa pun yang sedang kamu bawa hari ini, ceritakan saja. Kami mau mendengar dan mendoakan.
          </p>
        </Rise>
        <Rise delay={180}>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-9">
            <ButtonLink href="/pertolongan" variant="light" size="lg">
              Mulai bercerita <Icon.arrowRight className="h-4 w-4" />
            </ButtonLink>
            <p className="text-sm text-sand-100/65">Gratis, tidak dipungut biaya.</p>
          </div>
        </Rise>
        <Rise delay={260}>
          <RuangTiles className="mt-10 sm:mt-14" />
        </Rise>
      </Container>
      <HeroLip />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Bab Ruang Cerita
   ═══════════════════════════════════════════════════════════════════════════ */

function CeritaChapter() {
  return (
    <section id="bab-cerita" className="relative scroll-mt-20 overflow-hidden bg-cream py-20 sm:py-28 lg:py-40">
      <Container size="wide">
        <ChapterHeading
          ruang={getRuang("ruang-cerita")}
          description="Ada hari ketika didengarkan saja sudah berarti banyak. Di sini, kamu boleh datang dengan ceritamu, apa adanya."
        />

        <div className="mt-16 grid gap-16 sm:mt-20 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Kolase foto dengan kecepatan parallax berbeda */}
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none">
            <Parallax
              speed={-3}
              className="absolute inset-0 hidden -translate-x-4 translate-y-4 rounded-[2rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.aboutFriends}
                alt="Sekelompok teman duduk berangkulan menghadap laut"
                sizes="(min-width: 1024px) 38vw, 512px"
                strength={8}
                className="aspect-[4/5] rounded-[2rem] bg-sand-200 shadow-warm-lg"
              />
            </Reveal>
            <Parallax speed={-5} className="absolute -bottom-10 -right-3 hidden w-2/5 sm:block lg:-right-10">
              <Reveal variant="zoom" delay={250}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-[6px] border-cream bg-sand-200 shadow-deep">
                  <Image src={photos.aboutHands} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </Reveal>
            </Parallax>
          </div>

          <div className="lg:col-span-7 lg:pl-6 lg:pt-8">
            <Reveal>
              <h3 className="text-title text-ink">Cara kami menemanimu</h3>
            </Reveal>
            <ol className="mt-6 border-t border-sand-300/70 sm:mt-8">
              {values.map((v, i) => (
                <Reveal
                  as="li"
                  key={v.title}
                  delay={i * 90}
                  className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-sand-300/70 py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-6 sm:py-8"
                >
                  <span className="font-display text-4xl font-semibold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-maroon-400)] group-hover:text-maroon-400 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-xl font-semibold text-ink sm:text-2xl">{v.title}</h4>
                    <p className="mt-1.5 max-w-md leading-relaxed text-sand-700">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={200}>
              <div className="mt-8 sm:mt-9">
                <ArrowLink href="/tentang-kami">Kenali kami lebih jauh</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

Catatan: teks hero "Gratis Tidak dipungut biaya." di versi lama kehilangan tanda baca. Di sini sudah diperbaiki menjadi "Gratis, tidak dipungut biaya."

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Cek urutan section**

Run: `curl -s http://localhost:3001/ | grep -oE 'id="(ruang|bab-pengharapan|bab-doa|bab-cerita|bab-belajar|cerita|support)"' | uniq`
Expected (berurutan): `id="ruang"`, `id="bab-pengharapan"`, `id="bab-doa"`, `id="bab-cerita"`, `id="bab-belajar"`, `id="cerita"`, `id="support"`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "Beranda disusun per bab ruang dengan satu formulir umum"
```

---

### Task 12: Tautan, pengalihan, menu, sitemap, dan README

**Files:**
- Modify: `src/app/(site)/pertolongan/page.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `README.md`

- [ ] **Step 1: Alihkan kategori lama di `/pertolongan`**

Tambah `import { redirect } from "next/navigation";`. Tepat setelah `const { category } = await searchParams;`, tambahkan:

```ts
  // Tautan lama ke kategori ini sekarang punya formulir sendiri di halaman ruangnya.
  if (category === "doa") redirect("/ruang-doa#kirim-doa");
  if (category === "konseling") redirect("/ruang-cerita#ceritakan");
```

- [ ] **Step 2: Menu "Pelayanan" aktif di halaman ruang**

Di `src/components/site-header.tsx`, ganti fungsi `isActive` dengan:

```ts
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/layanan" && pathname.startsWith("/ruang-"));
```

- [ ] **Step 3: Footer menautkan ke halaman ruang**

Di `src/components/site-footer.tsx`:
- Ubah import menjadi `import { ruang, ruangHref } from "@/lib/ruang";`.
- Ganti `href={`/layanan#${r.slug}`}` dengan `href={ruangHref(r.slug)}`.

- [ ] **Step 4: Sitemap**

Di `src/app/sitemap.ts`, tambahkan setelah baris `/layanan`:

```ts
    { url: `${site.url}/ruang-pengharapan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/ruang-doa`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/ruang-cerita`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/ruang-belajar`, changeFrequency: "monthly", priority: 0.8 },
```

- [ ] **Step 5: README**

Ganti baris `| Pelayanan (4 ruang) | `/layanan` | statis (`src/lib/ruang.ts`) |` dengan:

```md
| Pelayanan (ringkasan 4 ruang) | `/layanan` | statis (`src/lib/ruang.ts`) |
| Ruang Pengharapan | `/ruang-pengharapan` | tulisan Renungan + video sosmed + kutipan |
| Ruang Doa | `/ruang-doa` | statis + formulir doa (`source=doa`) |
| Ruang Cerita | `/ruang-cerita` | statis + formulir cerita (`source=cerita`) |
| Ruang Belajar | `/ruang-belajar` | komunitas + ProCon (statis) |
```

Setelah baris `| Ruang pelayanan & jadwal rutin | `src/lib/ruang.ts` |`, tambahkan:

```md
| Komunitas belajar (masih contoh) | `src/lib/komunitas.ts` |
| ProCon (masih contoh) | `src/lib/procon.ts` |
```

- [ ] **Step 6: Pastikan tidak ada tautan lama tersisa**

Run: `grep -rn "layanan#\|pertolongan?category=" src`
Expected: tidak ada output.

Run: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "http://localhost:3001/pertolongan?category=doa"`
Expected: `307 http://localhost:3001/ruang-doa#kirim-doa`.

- [ ] **Step 7: Typecheck dan commit**

Run: `npm run typecheck`
Expected: PASS.

```bash
git add "src/app/(site)/pertolongan/page.tsx" src/components/site-header.tsx src/components/site-footer.tsx src/app/sitemap.ts README.md
git commit -m "Tautan, menu, dan sitemap untuk halaman ruang"
```

---

### Task 13 (opsional, repo `enkg/`): ProCon di ENKG menautkan ke JP

Kerjakan **setelah** halaman JP ter-deploy, supaya tautannya tidak 404. `enkg/` adalah repo git terpisah, dan mungkin sedang dikerjakan sesi lain, jadi cek `git -C ../enkg status` dulu.

**Files:**
- Modify: `../enkg/src/content/procon.ts`
- Modify: `../enkg/src/components/sections/procon.tsx`

- [ ] **Step 1:** Di `procon.ts`, ubah `partnerSite` menjadi:

```ts
  partnerSite: { name: "Janji Pengharapan", url: "https://janjipengharapan.com/ruang-belajar#procon" },
```

- [ ] **Step 2:** Di `procon.tsx`, ganti paragraf "Jadwal lengkap dan pendaftaran ProCon segera tersedia..." dengan:

```tsx
          <p className="max-w-xl text-cream-100/75">
            Jadwal lengkap ProCon ada di{" "}
            <a
              href={procon.partnerSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sun-300 underline underline-offset-4"
            >
              situs {procon.partnerSite.name}
            </a>
            . Sementara itu, tanya jadwal terdekat lewat WhatsApp.
          </p>
```

- [ ] **Step 3:** Jalankan typecheck proyek ENKG (lihat `package.json`-nya), lalu commit di repo `enkg/`: `git commit -m "ProCon menautkan ke Ruang Belajar di situs Janji Pengharapan"`.

---

### Task 14: Verifikasi menyeluruh

- [ ] **Step 1: Tes dan tipe**

Run: `npm run typecheck && npm run test:forms`
Expected: typecheck bersih, `# pass 30`, `# fail 0`.

- [ ] **Step 2: Cek aturan copy di file baru**

```bash
grep -rn "—" src/components/sections src/components/help-form*.tsx src/lib/komunitas.ts src/lib/procon.ts "src/app/(site)"/ruang-*
grep -rni "donasi\|gereja lokal\|sembako" src
```

Expected: tidak ada output. Em dash di dalam komentar kode boleh, tapi tetap lebih baik dihapus.

- [ ] **Step 3: Screenshot 390px dan 1440px (di luar repo)**

Browser Playwright sudah ada di cache (`~/Library/Caches/ms-playwright`). Pasang `playwright-core` di folder sementara supaya repo tidak bertambah dependensi:

```bash
mkdir -p "$TMPDIR/jp-shots" && cd "$TMPDIR/jp-shots" && npm i --silent playwright-core
cat > shot.mjs <<'JS'
import { chromium } from "playwright-core";

const pages = ["/", "/ruang-pengharapan", "/ruang-doa", "/ruang-cerita", "/ruang-belajar", "/layanan"];
const b = await chromium.launch({ executablePath: process.env.EXE });

for (const [name, width, height] of [["mobile", 390, 844], ["desktop", 1440, 900]]) {
  for (const path of pages) {
    const p = await b.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await p.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle", timeout: 90000 });
    const file = `${name}${path === "/" ? "-home" : path.replaceAll("/", "-")}`;
    await p.screenshot({ path: `${file}-first.png` });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${file}-full.png`, fullPage: true });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(file, "overflow:", overflow);
    await p.close();
  }
}

// Formulir doa: 2 langkah, tanpa pilihan kebutuhan, lolos validasi server.
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("http://localhost:3001/ruang-doa#kirim-doa", { waitUntil: "networkidle" });
const form = p.locator("#kirim-doa");
console.log("doa steps:", await form.getByText("1 / 2").count(), "need step:", await form.getByText("Kebutuhanmu").count());
await form.locator("textarea[name=message]").fill("Tolong doakan keluarga saya.");
await form.getByRole("button", { name: /Lanjut/ }).click();
console.log("heading kontak:", await form.getByText("Mau kami kabari?").count());
await form.getByText("Saya ingin mengirim tanpa nama").click();
await form.getByText("Belum ingin dihubungi").click();
await form.getByRole("button", { name: /Kirim pokok doa/ }).click();
await p.waitForTimeout(3000);
console.log("hasil:", (await form.getByRole("alert").allTextContents()).join(" | ") || (await form.getByRole("status").first().textContent()));
await b.close();
JS
EXE=$(ls -d ~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell | tail -1) node shot.mjs
```

Expected:
- Semua baris `overflow: false`.
- `doa steps: 1 need step: 0`, lalu `heading kontak: 1`.
- `hasil:` berisi "Maaf, ceritamu belum berhasil terkirim…". Ini wajar karena Supabase lokal mati. Artinya validasi browser dan server lolos. Kalau yang muncul "Ada sedikit yang perlu dilengkapi", berarti validasi server menolak, dan Task 2 atau Task 5 perlu dicek.

- [ ] **Step 4: Tinjau screenshot**

Buka file `.png` di `$TMPDIR/jp-shots` dan cek:
- **Layar pertama 390px tiap halaman ruang:** nama ruang, ringkasan, dan tombol utama terlihat tanpa digulir.
- **Lengkung hero:** warnanya sama dengan section sesudahnya.
- **Latar:** tidak ada dua section berurutan dengan latar yang sama (lihat tabel di Task 11 dan komentar tone di Task 10).
- **Beranda:** judul bab "Ruang Pengharapan", "Ruang Doa", "Ruang Cerita", dan "Ruang Belajar" muncul berurutan.
- **Kartu ProCon:** teks terbaca di kartu emas dan kartu gelap.
- **`RuangNav`:** tile ruang yang sedang dibuka bertanda "Kamu di sini".

- [ ] **Step 5: Commit perbaikan kecil hasil tinjauan (kalau ada)**

```bash
git add -A src
git commit -m "Rapikan tampilan halaman ruang"
```

---

## Setelah deploy

- **Migrasi:** `./deploy.sh` menjalankan `supabase/migrations/20260915120000_help_requests_source_details.sql` sebelum build. Cek dengan `deploy/migrate.sh status` di server.
- **Kirim satu pokok doa uji** dari `/ruang-doa`. Admin `/admin/permohonan` harus menampilkan "· Ruang Doa", dan detailnya menampilkan "Doa untuk".

## Yang perlu dikonfirmasi pemilik (tidak menghalangi pengerjaan)

1. **Komunitas belajar:** nama, isi, jadwal, dan format asli (`src/lib/komunitas.ts`).
2. **ProCon:** daftar event, tanggal, dan link pendaftaran (`src/lib/procon.ts`).
3. **Doa Kesembuhan:** jadwal dan link Zoom yang disebut di FAQ Ruang Doa, masih mengikuti `ruang.ts`.
4. **Pilihan kontak bawaan formulir Doa:** WhatsApp (sekarang) atau "Belum ingin dihubungi".
5. **Urutan bab di beranda:** Doa dulu atau Cerita dulu.
6. **Kutipan Filipi 4:6** di samping formulir doa: sesuaikan dengan terjemahan yang dipakai JP.

## Self-review terhadap permintaan

| Permintaan | Task |
|---|---|
| Tiap ruang punya section sendiri | 7, 8, 9, 10 |
| Pengharapan berisi tulisan/renungan | 8 (renungan, video, kutipan), 10 |
| Doa punya section dan form khusus tanpa memilih kebutuhan | 2, 4, 5, 9, 10 |
| Cerita punya form sendiri, section cerita yang sudah ada dipakai | 5, 8 (`CaraMenemani`), 9, 10 (`HelpSteps`) |
| Form di beranda jadi formulir umum | 9 (`GeneralFormSection`), 11 |
| Ruang Belajar: komunitas belajar bersama | 6, 9, 10 |
| Ruang Belajar: ProCon dengan desain disesuaikan | 6, 9 (port gaya JP), 10, 13 |
| Beranda terstruktur per ruang dan terlihat lebih bagus | 7 (`ChapterHeading`, `RuangTiles`), 11, 14 |
| Data tersimpan rapi untuk tim | 1, 3 |
