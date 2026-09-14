"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitHelpRequest, type FormState } from "@/app/actions/help";
import { Checkbox, Field, Input, OptionCard, Textarea } from "@/components/form-fields";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui";
import { crisis } from "@/lib/crisis";
import { validateHelp, type HelpValues } from "@/lib/help-validation";
import {
  CONTACT_PREF_LABEL,
  HELP_CATEGORY_HINT,
  HELP_CATEGORY_LABEL,
  URGENCY_LABEL,
  type HelpCategory,
  type Urgency,
  type ContactPreference,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const initialState: FormState = { status: "idle" };

/**
 * Pilihan yang tampil di formulir. "kebutuhan" tetap sah di database supaya permintaan
 * lama masih terbaca di admin, tapi tidak ditawarkan lagi: dua pilihan soal ekonomi
 * terasa terlalu mengotak-ngotakkan, dan JP tidak menjanjikan bantuan materi.
 */
const FORM_CATEGORIES: HelpCategory[] = ["doa", "konseling", "kunjungan", "keuangan", "lainnya"];
const categoryIcons: Record<HelpCategory, keyof typeof Icon> = {
  doa: "hands",
  konseling: "users",
  kebutuhan: "gift",
  kunjungan: "heart",
  keuangan: "shield",
  lainnya: "spark",
};
const steps = [
  {
    title: "Kebutuhanmu",
    heading: "Apa yang bisa kami bantu?",
    hint: "Pilih yang paling dekat dengan keadaanmu. Belum yakin juga tidak apa-apa.",
  },
  {
    title: "Ceritamu",
    heading: "Kami ingin mendengarkan.",
    hint: "Mulai dari bagian yang nyaman kamu bagikan. Tidak perlu menceritakan semuanya sekaligus.",
  },
  {
    title: "Hubungi kamu",
    heading: "Bagaimana kami bisa menyapamu?",
    hint: "Pilih cara yang nyaman. Kalau belum ingin dihubungi, kami tetap menerima ceritamu.",
  },
] as const;
const urgencyHints = {
  biasa: "Tidak ada kebutuhan segera",
  mendesak: "Ada yang perlu dibantu dalam waktu dekat",
  darurat: "Keselamatan sedang terancam",
};

export function HelpForm({ initialCategory }: { initialCategory?: HelpCategory }) {
  const [state, dispatch, pending] = useActionState(submitHelpRequest, initialState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<HelpValues>({
    category: initialCategory && FORM_CATEGORIES.includes(initialCategory) ? initialCategory : "",
    urgency: "biasa",
    message: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    contactPreference: "whatsapp",
    isAnonymous: false,
    isConfidential: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showServerError, setShowServerError] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastPosition = useRef({ step, status: state.status });

  const update = <K extends keyof HelpValues>(key: K, value: HelpValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (key === "contactPreference") {
        delete next.contact_preference;
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
    if (state.fieldErrors) {
      const keys = Object.keys(state.fieldErrors);
      setStep(keys.includes("category") ? 0 : keys.some((k) => ["message", "urgency"].includes(k)) ? 1 : 2);
    }
  }, [state]);

  const focusError = (next: Record<string, string>) => {
    requestAnimationFrame(() => {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  };
  const advance = () => {
    const next = validateHelp(values, step);
    setErrors(next);
    if (Object.keys(next).length) {
      focusError(next);
      return;
    }
    setStep((current) => Math.min(current + 1, 2));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    if (step < 2) {
      advance();
      return;
    }
    const next = validateHelp(values);
    setErrors(next);
    if (Object.keys(next).length) {
      setStep(next.category ? 0 : next.message || next.urgency ? 1 : 2);
      focusError(next);
      return;
    }
    // Dispatch manually so React does not clear the story when the server returns an error.
    const data = new FormData(event.currentTarget);
    setShowServerError(false);
    startTransition(() => dispatch(data));
  };

  if (state.status === "success")
    return (
      <div ref={topRef} className="scroll-mt-28 py-6 text-center" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-maroon-50 text-maroon-700 ring-1 ring-maroon-200">
          <Icon.check className="h-7 w-7" />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="font-display mt-6 text-3xl text-ink">
          Terima kasih sudah bercerita.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-sand-700">
          {values.contactPreference === "tidak_perlu"
            ? "Ceritamu sudah kami terima. Sesuai pilihanmu, tim tidak akan menghubungimu. Jika nanti ingin berbicara, kamu boleh menghubungi kami kembali."
            : `Ceritamu sudah kami terima. Tim akan membacanya dan menghubungimu melalui ${CONTACT_PREF_LABEL[values.contactPreference as ContactPreference]}. Kamu tidak perlu menunggu di halaman ini.`}
        </p>
        {state.refCode && (
          <div className="mx-auto mt-7 max-w-xs rounded-2xl bg-paper p-5">
            <p className="text-xs text-sand-700">Nomor ceritamu</p>
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

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-sand-700">
        <span className="inline-flex items-center gap-2">
          <Icon.heart className="h-4 w-4 text-maroon-600" />
          Pelan-pelan saja, sesuai kesiapanmu.
        </span>
        <span className="shrink-0 tabular-nums">{step + 1} / 3</span>
      </div>
      <ol className="mb-8 grid grid-cols-3 gap-3" aria-label="Langkah bercerita">
        {steps.map((item, index) => (
          <li key={item.title}>
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
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl leading-tight text-ink sm:text-3xl">
        {steps[step].heading}
      </h2>
      <p className="mt-3 mb-7 text-sm leading-6 text-sand-700">{steps[step].hint}</p>
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
        <fieldset hidden={step !== 0} disabled={pending} className="form-step space-y-5">
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
          {errors.category && (
            <p id="category-error" role="alert" className="text-sm text-red-700">
              {errors.category}
            </p>
          )}
          <p className="rounded-xl bg-sand-100 p-4 text-xs leading-relaxed text-sand-700">
            Pilihan ini membantu tim memahami ceritamu. Bentuk bantuan akan dibicarakan bersama, sesuai kebutuhan dan
            ketersediaan.
          </p>
        </fieldset>

        <fieldset hidden={step !== 1} disabled={pending} className="form-step space-y-6">
          <legend className="sr-only">Bagikan ceritamu</legend>
          <Field
            label="Yang ingin kamu ceritakan"
            htmlFor="message"
            error={errors.message}
            hint="Satu atau dua kalimat untuk memulai juga boleh."
          >
            <Textarea
              id="message"
              name="message"
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              error={errors.message}
              aria-describedby="message-hint message-count"
              placeholder="Akhir-akhir ini saya merasa… Saya berharap bisa…"
              maxLength={4000}
              className="min-h-48"
            />
            <p id="message-count" className="mt-2 text-right text-xs tabular-nums text-sand-700">
              {values.message.length.toLocaleString("id-ID")} / 4.000 karakter
            </p>
          </Field>
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
            {errors.urgency && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {errors.urgency}
              </p>
            )}
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
          <Checkbox
            name="is_confidential"
            checked={values.isConfidential}
            onChange={(value) => update("isConfidential", value)}
            title="Jaga isi ceritaku tetap pribadi"
            description="Tim hanya menerima pemberitahuan cerita baru tanpa isinya. Ceritamu tetap bisa dibaca oleh tim yang mendampingi."
          />
        </fieldset>

        <fieldset hidden={step !== 2} disabled={pending} className="form-step space-y-6">
          <legend className="sr-only">Pilihan kontak dan ringkasan</legend>
          <Checkbox
            name="is_anonymous"
            checked={values.isAnonymous}
            onChange={(value) => update("isAnonymous", value)}
            title="Saya ingin bercerita tanpa nama"
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
            <legend className="mb-3 text-sm font-semibold text-ink">Cara yang nyaman untuk dihubungi</legend>
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
            {errors.contact_preference && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {errors.contact_preference}
              </p>
            )}
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
              Kami akan menerima ceritamu tanpa menghubungimu. Nomor telepon dan email tidak ikut dikirim.
            </p>
          )}
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
          <div className="rounded-2xl border border-sand-200 bg-sand-100/70 p-5">
            <p className="mb-3 text-sm font-semibold text-maroon-800">Sebelum kamu mengirim</p>
            <dl className="space-y-2 text-sm">
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-sand-700">Dukungan</dt>
                <dd className="font-medium text-ink">{HELP_CATEGORY_LABEL[values.category as HelpCategory]}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-sand-700">Balasan melalui</dt>
                <dd className="font-medium text-ink">
                  {CONTACT_PREF_LABEL[values.contactPreference as ContactPreference]}
                </dd>
              </div>
            </dl>
            <details className="mt-4 border-t border-sand-300/70 pt-3">
              <summary className="cursor-pointer text-sm font-semibold text-maroon-700">Baca kembali ceritamu</summary>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-sand-800">{values.message}</p>
            </details>
            <p className="mt-4 text-xs leading-relaxed text-sand-700">
              Dengan mengirim, kamu mengizinkan tim JP membaca cerita dan menggunakan kontak sesuai pilihanmu untuk
              menindaklanjutinya.
            </p>
          </div>
        </fieldset>

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
          {step < 2 ? (
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
              {step === 0 ? "Lanjut ke cerita" : "Pilih cara dihubungi"}
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
                  Kirim ceritaku
                  <Icon.arrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
        <p role="status" className="text-center text-xs leading-relaxed text-sand-700">
          {pending
            ? "Tunggu sebentar, ya. Ceritamu sedang dikirim."
            : "Ceritamu baru dikirim setelah kamu menekan “Kirim ceritaku”."}
        </p>
      </form>
    </div>
  );
}
