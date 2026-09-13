"use client";

import { useActionState, useState } from "react";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";
import { Field, Input, Textarea } from "@/components/form-fields";
import { submitContactMessage, type FormState } from "@/app/actions/help";

const initialState: FormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);
  const [count, setCount] = useState(0);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="animate-rise rounded-2xl bg-sand-100 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-maroon-700 text-sand-50">
          <Icon.check className="h-7 w-7" />
        </div>
        <h3 className="font-display mt-5 text-xl font-semibold text-ink">Pesanmu sudah terkirim</h3>
        <p className="mt-2 leading-relaxed text-sand-700">
          Terima kasih sudah menyapa. Kami akan membalas lewat email atau WhatsApp secepatnya.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      <Field label="Nama" htmlFor="c-name" error={errors.name}>
        <Input id="c-name" name="name" error={errors.name} placeholder="Nama kamu" autoComplete="name" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="c-email" error={errors.email} optional>
          <Input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            error={errors.email}
            placeholder="nama@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Nomor WhatsApp" htmlFor="c-phone" optional>
          <Input
            id="c-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Perihal" htmlFor="c-subject" optional>
        <Input id="c-subject" name="subject" placeholder="Misalnya: mau ikut komsel" />
      </Field>

      <Field label="Pesan" htmlFor="c-message" error={errors.message}>
        <Textarea
          id="c-message"
          name="message"
          error={errors.message}
          placeholder="Tulis pesanmu di sini…"
          maxLength={4000}
          onChange={(e) => setCount(e.target.value.length)}
        />
        <p className="mt-1.5 text-right text-xs text-sand-500">{count}/4000</p>
      </Field>

      {state.status === "error" && state.message && (
        <div role="alert" className="animate-fade rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Mengirim…" : "Kirim pesan"}
        {!pending && <Icon.arrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
