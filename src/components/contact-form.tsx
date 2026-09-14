"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitContactMessage, type FormState } from "@/app/actions/help";
import { Field, Input, Textarea } from "@/components/form-fields";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";
import { validateContact, type ContactValues } from "@/lib/help-validation";

const initialState: FormState = { status: "idle" };

export function ContactForm() {
  const [state, dispatch, pending] = useActionState(submitContactMessage, initialState);
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showServerError, setShowServerError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (state.status === "error") {
      setErrors(state.fieldErrors ?? {});
      setShowServerError(true);
    }
    if (state.status === "success") successRef.current?.focus();
  }, [state]);
  const update = (key: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (key === "phone" && value && !values.email) delete next.email;
      return next;
    });
    setShowServerError(false);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const next = validateContact(values);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(),
      );
      return;
    }
    const data = new FormData(event.currentTarget);
    setShowServerError(false);
    startTransition(() => dispatch(data));
  };
  if (state.status === "success")
    return (
      <div role="status" className="py-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-maroon-50 text-maroon-700">
          <Icon.check className="h-6 w-6" />
        </span>
        <h3 ref={successRef} tabIndex={-1} className="font-display mt-5 text-2xl text-ink">
          Terima kasih sudah menyapa.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-sand-700">
          Pesanmu sudah kami terima. Tim akan membalas melalui kontak yang kamu tinggalkan. Kamu tidak perlu menunggu di
          halaman ini.
        </p>
      </div>
    );
  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={pending} className="space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />
      <fieldset disabled={pending} className="space-y-6">
        <legend className="sr-only">Pesan untuk tim Janji Pengharapan</legend>
        <Field label="Kami boleh memanggilmu siapa?" htmlFor="c-name" error={errors.name}>
          <Input
            id="c-name"
            name="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
            placeholder="Nama panggilan juga boleh"
            autoComplete="name"
            maxLength={120}
          />
        </Field>
        <div>
          <p id="contact-choice-hint" className="mb-3 text-sm leading-relaxed text-sand-700">
            Isi email atau nomor WhatsApp. Salah satu saja cukup untuk kami membalas.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="c-email" error={errors.email}>
              <Input
                id="c-email"
                name="email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
                aria-describedby="contact-choice-hint"
                placeholder="nama@email.com"
                autoComplete="email"
                maxLength={160}
              />
            </Field>
            <Field label="Nomor WhatsApp" htmlFor="c-phone" error={errors.phone}>
              <Input
                id="c-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                error={errors.phone}
                aria-describedby="contact-choice-hint"
                placeholder="081234567890"
                autoComplete="tel"
                maxLength={30}
              />
            </Field>
          </div>
        </div>
        <Field label="Apa yang ingin kamu sampaikan?" htmlFor="c-message" error={errors.message}>
          <Textarea
            id="c-message"
            name="message"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            error={errors.message}
            placeholder="Halo, saya ingin bertanya tentang…"
            aria-describedby="c-message-count"
            maxLength={4000}
            className="min-h-44"
          />
          <p id="c-message-count" className="mt-2 text-right text-xs tabular-nums text-sand-700">
            {values.message.length.toLocaleString("id-ID")} / 4.000 karakter
          </p>
        </Field>
        <Field label="Topik pesan" htmlFor="c-subject" optional error={errors.subject}>
          <Input
            id="c-subject"
            name="subject"
            value={values.subject}
            onChange={(e) => update("subject", e.target.value)}
            error={errors.subject}
            placeholder="Misalnya: ingin mengenal komunitas"
            maxLength={160}
          />
        </Field>
      </fieldset>
      {showServerError && state.message && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800">
          {state.message}
        </p>
      )}
      <div className="border-t border-sand-200 pt-6">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
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
              Kirim pesan
              <Icon.arrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p role="status" className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-sand-700">
          <Icon.shield className="h-4 w-4 shrink-0 text-maroon-600" />
          {pending ? "Tunggu sebentar, ya. Pesanmu sedang dikirim." : "Kontakmu digunakan untuk menanggapi pesan ini."}
        </p>
      </div>
      <noscript>
        <p className="text-sm text-maroon-800">
          Aktifkan JavaScript untuk mengirim formulir, atau gunakan pilihan kontak di atas.
        </p>
      </noscript>
    </form>
  );
}
