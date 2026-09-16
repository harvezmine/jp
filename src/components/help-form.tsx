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
      FIXED_CATEGORY[source] ?? (initialCategory && FORM_CATEGORIES.includes(initialCategory) ? initialCategory : ""),
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
