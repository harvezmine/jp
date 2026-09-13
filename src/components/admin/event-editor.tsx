"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui";
import { Field, Input, Textarea } from "@/components/form-fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { PublishToggle } from "@/components/admin/toggle";
import { submitKeepingValues } from "@/components/admin/submit-keeping-values";
import { Icon } from "@/components/icons";
import { saveEvent, type ActionState } from "@/app/actions/admin";
import type { JPEvent } from "@/lib/types";
import { slugify, toWibInput } from "@/lib/utils";

const initial: ActionState = { status: "idle" };

export function EventEditor({ event }: { event?: JPEvent }) {
  const [state, action, pending] = useActionState(saveEvent, initial);
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));

  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <form onSubmit={submitKeepingValues(action)} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="space-y-5 lg:col-span-8">
        <Field label="Nama event" htmlFor="title">
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misalnya: Malam Doa Pengharapan"
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Mulai" htmlFor="starts_at">
            <Input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={toWibInput(event?.starts_at)}
              required
            />
          </Field>
          <Field label="Selesai" htmlFor="ends_at" optional>
            <Input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toWibInput(event?.ends_at)}
            />
          </Field>
        </div>

        <Field
          label="Deskripsi"
          htmlFor="description"
          hint="Format sama seperti tulisan: ## sub-judul, - daftar, **tebal**."
        >
          <Textarea
            id="description"
            name="description"
            defaultValue={event?.description ?? ""}
            className="min-h-64"
            placeholder="Apa yang akan terjadi di acara ini, untuk siapa, dan apa yang perlu dibawa."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama lokasi" htmlFor="location" optional>
            <Input id="location" name="location" defaultValue={event?.location ?? ""} placeholder="Aula JP" />
          </Field>
          <Field label="Tautan peta" htmlFor="map_url" optional>
            <Input id="map_url" name="map_url" defaultValue={event?.map_url ?? ""} placeholder="https://maps.google.com/…" />
          </Field>
        </div>

        <Field label="Alamat lengkap" htmlFor="address" optional>
          <Input id="address" name="address" defaultValue={event?.address ?? ""} placeholder="Jl. Contoh Raya No. 12, Jakarta Selatan" />
        </Field>

        <Field
          label="Tautan pendaftaran"
          htmlFor="register_url"
          hint="Kosongkan bila pendaftaran cukup lewat WhatsApp."
          optional
        >
          <Input id="register_url" name="register_url" defaultValue={event?.register_url ?? ""} placeholder="https://forms.gle/…" />
        </Field>
      </div>

      <aside className="space-y-5 lg:col-span-4">
        <PublishToggle
          name="published"
          defaultChecked={event?.published ?? false}
          label="Terbitkan"
          description="Kalau mati, event hanya terlihat di panel ini."
        />

        <Field label="Slug URL" htmlFor="slug" hint={`janjipengharapan.com/event/${effectiveSlug || "…"}`}>
          <Input
            id="slug"
            name="slug"
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </Field>

        <ImageUpload name="cover_url" defaultValue={event?.cover_url} />

        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.message}
          </p>
        )}

        <div className="sticky bottom-20 lg:bottom-6">
          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? "Menyimpan…" : "Simpan"}
            {!pending && <Icon.check className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </form>
  );
}
