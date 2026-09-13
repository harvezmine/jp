"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui";
import { Field, Input, Select, Textarea } from "@/components/form-fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { PublishToggle } from "@/components/admin/toggle";
import { submitKeepingValues } from "@/components/admin/submit-keeping-values";
import { Icon } from "@/components/icons";
import { savePost, type ActionState } from "@/app/actions/admin";
import { POST_CATEGORY_LABEL, type Post } from "@/lib/types";
import { slugify } from "@/lib/utils";

const initial: ActionState = { status: "idle" };

export function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");

  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <form onSubmit={submitKeepingValues(action)} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {post && <input type="hidden" name="id" value={post.id} />}
      {post?.published_at && (
        <input type="hidden" name="published_at" value={post.published_at} />
      )}

      {/* Kolom utama */}
      <div className="space-y-5 lg:col-span-8">
        <Field label="Judul" htmlFor="title">
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul tulisan"
            required
          />
        </Field>

        <Field
          label="Ringkasan"
          htmlFor="excerpt"
          hint="Satu-dua kalimat yang muncul di kartu dan preview WhatsApp."
          optional
        >
          <Input
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            placeholder="Ringkasan singkat"
            maxLength={400}
          />
        </Field>

        <Field
          label="Isi tulisan"
          htmlFor="body"
          hint="Baris kosong memisahkan paragraf. ## untuk sub-judul, > untuk kutipan, - untuk daftar, **tebal**."
        >
          <Textarea
            id="body"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[28rem] font-mono text-sm"
            placeholder={"Tulis di sini…\n\n## Sub-judul\n\nParagraf berikutnya."}
            required
          />
          <p className="mt-1.5 text-right text-xs text-sand-500">
            {body.trim() ? body.trim().split(/\s+/).length : 0} kata
          </p>
        </Field>
      </div>

      {/* Kolom samping — di HP jatuh ke bawah, bukan disempitkan */}
      <aside className="space-y-5 lg:col-span-4">
        <PublishToggle
          name="published"
          defaultChecked={post?.published ?? false}
          label="Terbitkan"
          description="Kalau mati, tulisan tersimpan sebagai draf."
        />

        <Field label="Kategori" htmlFor="category">
          <Select id="category" name="category" defaultValue={post?.category ?? "renungan"}>
            {Object.entries(POST_CATEGORY_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Penulis" htmlFor="author" optional>
          <Input id="author" name="author" defaultValue={post?.author ?? "Tim JP"} />
        </Field>

        <Field
          label="Slug URL"
          htmlFor="slug"
          hint={`janjipengharapan.com/konten/${effectiveSlug || "…"}`}
        >
          <Input
            id="slug"
            name="slug"
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="otomatis-dari-judul"
          />
        </Field>

        <ImageUpload name="cover_url" defaultValue={post?.cover_url} />

        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.message}
          </p>
        )}

        <div className="sticky bottom-20 flex gap-3 lg:bottom-6">
          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? "Menyimpan…" : "Simpan"}
            {!pending && <Icon.check className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </form>
  );
}
