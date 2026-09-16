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
 * Pilihan yang tampil di formulir umum. Hanya tiga, karena sisanya sudah tercakup:
 * kunjungan dan soal pekerjaan/keuangan tetap masuk lewat "didoakan" atau "teman bercerita".
 * Nilai lama ("kebutuhan", "kunjungan", "keuangan") tetap sah di database supaya permintaan
 * lama masih terbaca di admin.
 */
export const FORM_CATEGORIES: HelpCategory[] = ["doa", "konseling", "lainnya"];

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
            <dd className="font-medium text-ink">
              {CONTACT_PREF_LABEL[values.contactPreference as ContactPreference]}
            </dd>
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
