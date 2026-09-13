"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui";
import { Checkbox, Field, Input, OptionCard, Textarea } from "@/components/form-fields";
import { submitHelpRequest, type FormState } from "@/app/actions/help";
import {
  CONTACT_PREF_LABEL,
  HELP_CATEGORY_HINT,
  HELP_CATEGORY_LABEL,
  URGENCY_LABEL,
  type ContactPreference,
  type HelpCategory,
  type Urgency,
} from "@/lib/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const initialState: FormState = { status: "idle" };

const categoryIcons: Record<HelpCategory, keyof typeof Icon> = {
  doa: "hands",
  konseling: "users",
  kebutuhan: "gift",
  kunjungan: "heart",
  keuangan: "shield",
  lainnya: "spark",
};

const urgencyHint: Record<Urgency, string> = {
  biasa: "Tidak ada tenggat khusus",
  mendesak: "Perlu ditangani beberapa hari ini",
  darurat: "Butuh respons secepatnya",
};

const steps = [
  { title: "Kebutuhan", caption: "Kamu butuh bantuan apa?" },
  { title: "Cerita", caption: "Ceritakan dengan bahasamu sendiri." },
  { title: "Kontak", caption: "Ke mana kami bisa menghubungimu?" },
] as const;

export function HelpForm() {
  const [state, formAction, pending] = useActionState(submitHelpRequest, initialState);
  const [step, setStep] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const [category, setCategory] = useState<HelpCategory>("doa");
  const [urgency, setUrgency] = useState<Urgency>("biasa");
  const [contactPref, setContactPref] = useState<ContactPreference>("whatsapp");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const topRef = useRef<HTMLDivElement>(null);
  const errors = { ...state.fieldErrors, ...localErrors };

  // Server menolak → lompat ke langkah yang bermasalah agar pengguna tidak
  // perlu menebak di mana letak kesalahannya.
  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    const keys = Object.keys(state.fieldErrors);
    if (keys.some((k) => ["category", "urgency"].includes(k))) setStep(0);
    else if (keys.includes("message")) setStep(1);
    else setStep(2);
  }, [state]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, state.status]);

  const validateStep = (index: number) => {
    const next: Record<string, string> = {};
    if (index === 1 && message.trim().length < 15) {
      next.message = "Ceritakan sedikit lebih banyak, ya.";
    }
    if (index === 2) {
      if (!isAnonymous && name.trim().length < 2) {
        next.name = "Tulis namamu, atau centang kirim tanpa nama.";
      }
      if (
        (contactPref === "whatsapp" || contactPref === "telepon") &&
        !/^[0-9+\-\s()]{8,}$/.test(phone)
      ) {
        next.phone = "Masukkan nomor yang bisa dihubungi.";
      }
      if (contactPref === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        next.email = "Alamat email ini sepertinya belum benar.";
      }
    }
    setLocalErrors(next);
    return Object.keys(next).length === 0;
  };

  /**
   * preventDefault() di sini bukan formalitas.
   *
   * Tombol "Lanjut" dan "Kirim permohonan" menempati posisi yang sama di pohon
   * JSX, jadi React memakai ulang node <button> yang sama dan hanya mengubah
   * atributnya. Saat setStep() berjalan sinkron di dalam event klik, type
   * tombol sudah berubah menjadi "submit" sebelum browser menentukan aksi
   * bawaannya, sehingga klik "Lanjut" ikut mengirim formulir yang belum
   * lengkap. preventDefault() memutus rantai itu; prop key di bawah membuat
   * React tidak lagi memakai ulang node-nya.
   */
  const goNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLocalErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  /* ── Layar sukses ───────────────────────────────────────────────────────── */
  if (state.status === "success") {
    return (
      <div ref={topRef} className="animate-rise rounded-[1.75rem] bg-white p-7 text-center shadow-warm-lg sm:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-maroon-700 text-sand-50">
          <Icon.check className="h-8 w-8" />
        </div>
        <h2 className="font-display mt-6 text-2xl font-semibold text-ink sm:text-3xl">
          Permohonanmu sudah kami terima.
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-sand-700">
          Terima kasih sudah bercerita. Kami akan segera menghubungimu, dan mulai hari ini kamu
          kami doakan.
        </p>

        {state.refCode && (
          <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-paper p-5">
            <p className="text-xs font-medium text-sand-600">Kode permohonan</p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-wide text-maroon-700">
              {state.refCode}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-sand-600">
              Simpan kode ini untuk menanyakan perkembangannya.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="outline">
            Kembali ke beranda
          </ButtonLink>
          <ButtonLink href={`https://wa.me/${site.whatsapp}`} external>
            <Icon.whatsapp className="h-4 w-4" />
            Hubungi pengurus
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* ── Formulir ───────────────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Indikator langkah */}
      <ol className="mb-8 flex gap-2" aria-label="Langkah pengisian">
        {steps.map((s, i) => (
          <li key={s.title} className="flex-1">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={cn(
                "w-full text-left",
                i < step ? "cursor-pointer" : "cursor-default",
              )}
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-colors duration-500",
                  i <= step ? "bg-maroon-700" : "bg-sand-300",
                )}
              />
              <span
                className={cn(
                  "mt-2 block text-xs font-semibold transition-colors sm:text-sm",
                  i <= step ? "text-maroon-700" : "text-sand-500",
                )}
              >
                {i + 1}. {s.title}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="font-display mb-6 text-xl text-ink sm:text-2xl">{steps[step].caption}</p>

      <form action={formAction} className="space-y-6">
        {/* Honeypot: disembunyikan dari pengguna dan pembaca layar */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
        />

        {/* ── Langkah 1: kebutuhan ───────────────────────────────────────── */}
        <fieldset hidden={step !== 0} className="space-y-6">
          <legend className="sr-only">Jenis bantuan</legend>

          <div>
            <p className="text-sm font-semibold text-ink">Bantuan yang dibutuhkan</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(HELP_CATEGORY_LABEL) as HelpCategory[]).map((key) => {
                const IconComp = Icon[categoryIcons[key]];
                return (
                  <OptionCard
                    key={key}
                    name="category"
                    value={key}
                    checked={category === key}
                    onChange={(v) => setCategory(v as HelpCategory)}
                    title={HELP_CATEGORY_LABEL[key]}
                    description={HELP_CATEGORY_HINT[key]}
                    icon={<IconComp className="h-4.5 w-4.5" />}
                  />
                );
              })}
            </div>
            {errors.category && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-700">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Seberapa mendesak?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {(Object.keys(URGENCY_LABEL) as Urgency[]).map((key) => (
                <OptionCard
                  key={key}
                  name="urgency"
                  value={key}
                  checked={urgency === key}
                  onChange={(v) => setUrgency(v as Urgency)}
                  title={URGENCY_LABEL[key]}
                  description={urgencyHint[key]}
                />
              ))}
            </div>
          </div>
        </fieldset>

        {/* ── Langkah 2: cerita ──────────────────────────────────────────── */}
        <fieldset hidden={step !== 1} className="space-y-6">
          <legend className="sr-only">Ceritamu</legend>

          <Field
            label="Ceritakan kepada kami"
            htmlFor="message"
            hint="Tidak perlu rapi. Tulis saja apa adanya."
            error={errors.message}
          >
            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={errors.message}
              placeholder="Contoh: Belakangan ini saya sering bertengkar dengan orang tua dan butuh teman bicara…"
              maxLength={4000}
            />
            <p className="mt-1.5 text-right text-xs text-sand-500">{message.length}/4000</p>
          </Field>

          <Checkbox
            name="is_confidential"
            checked={isConfidential}
            onChange={setIsConfidential}
            title="Anggap sebagai rahasia"
            description="Isi ceritamu tidak ikut terkirim lewat notifikasi WhatsApp atau email tim."
          />

          <div className="flex gap-3 rounded-xl bg-paper p-4">
            <Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-maroon-600" />
            <p className="text-xs leading-relaxed text-sand-700">
              Ceritamu hanya dibaca tim yang menanganinya, dan tidak akan dibagikan tanpa izinmu.
            </p>
          </div>
        </fieldset>

        {/* ── Langkah 3: kontak ──────────────────────────────────────────── */}
        <fieldset hidden={step !== 2} className="space-y-6">
          <legend className="sr-only">Data kontak</legend>

          <Checkbox
            name="is_anonymous"
            checked={isAnonymous}
            onChange={setIsAnonymous}
            title="Kirim tanpa nama"
            description="Namamu tidak disimpan. Isi nomor atau email kalau tetap mau kami hubungi."
          />

          {!isAnonymous && (
            <Field label="Nama" htmlFor="name" error={errors.name}>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Nama lengkap atau panggilan"
                autoComplete="name"
              />
            </Field>
          )}

          <div>
            <p className="text-sm font-semibold text-ink">Cara dihubungi</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(CONTACT_PREF_LABEL) as ContactPreference[]).map((key) => (
                <OptionCard
                  key={key}
                  name="contact_preference"
                  value={key}
                  checked={contactPref === key}
                  onChange={(v) => setContactPref(v as ContactPreference)}
                  title={CONTACT_PREF_LABEL[key]}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nomor WhatsApp atau telepon"
              htmlFor="phone"
              error={errors.phone}
              optional={contactPref === "email" || contactPref === "tidak_perlu"}
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
              />
            </Field>

            <Field
              label="Email"
              htmlFor="email"
              error={errors.email}
              optional={contactPref !== "email"}
            >
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </Field>
          </div>

          <Field label="Kota atau wilayah" htmlFor="city" optional>
            <Input id="city" name="city" placeholder="Jakarta Selatan" autoComplete="address-level2" />
          </Field>
        </fieldset>

        {/* Pesan error umum dari server */}
        {state.status === "error" && state.message && (
          <div
            role="alert"
            className="animate-fade flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm leading-relaxed text-red-800">{state.message}</p>
          </div>
        )}

        {/* Navigasi, tombol lebar penuh di HP */}
        <div className="flex flex-col-reverse gap-3 border-t border-sand-200 pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              key="back"
              type="button"
              variant="outline"
              onClick={goBack}
              className="w-full sm:w-auto"
            >
              <Icon.arrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step < steps.length - 1 ? (
            <Button key="next" type="button" onClick={goNext} size="lg" className="w-full sm:w-auto">
              Lanjut
              <Icon.arrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button key="submit" type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Mengirim…" : "Kirim permohonan"}
              {!pending && <Icon.arrowRight className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
