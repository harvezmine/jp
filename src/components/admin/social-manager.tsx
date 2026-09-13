"use client";

import { useActionState, useEffect, useState } from "react";

import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { Field, Input, Select, Textarea } from "@/components/form-fields";
import { PublishToggle } from "@/components/admin/toggle";
import { submitKeepingValues } from "@/components/admin/submit-keeping-values";
import { ImageUpload } from "@/components/admin/image-upload";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { deleteSocialPost, saveSocialPost, type ActionState } from "@/app/actions/admin";
import type { SocialPost } from "@/lib/types";

const initial: ActionState = { status: "idle" };

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

function SocialForm({ post, onDone }: { post?: SocialPost; onDone: () => void }) {
  const [state, action, pending] = useActionState(saveSocialPost, initial);
  const uid = post?.id ?? "baru";

  useEffect(() => {
    if (state.status === "success") onDone();
  }, [state.status, onDone]);

  return (
    <Card className="p-5">
      <form onSubmit={submitKeepingValues(action)} className="space-y-4">
        {post && <input type="hidden" name="id" value={post.id} />}

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Platform" htmlFor={`platform-${uid}`}>
            <Select id={`platform-${uid}`} name="platform" defaultValue={post?.platform ?? "instagram"}>
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Tautan konten"
              htmlFor={`url-${uid}`}
              hint="Salin dari tombol Bagikan → Salin tautan di aplikasinya."
            >
              <Input
                id={`url-${uid}`}
                name="url"
                type="url"
                defaultValue={post?.url ?? ""}
                placeholder="https://www.instagram.com/p/…"
                required
              />
            </Field>
          </div>
        </div>

        <Field label="Keterangan" htmlFor={`caption-${uid}`} hint="Kalimat pembuka yang tampil di kartu.">
          <Textarea
            id={`caption-${uid}`}
            name="caption"
            defaultValue={post?.caption ?? ""}
            className="min-h-20"
          />
        </Field>

        <ImageUpload
          name="thumbnail_url"
          defaultValue={post?.thumbnail_url}
          label="Thumbnail (opsional)"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Urutan" htmlFor={`order-${uid}`} hint="Angka kecil tampil lebih dulu.">
            <Input
              id={`order-${uid}`}
              name="sort_order"
              type="number"
              inputMode="numeric"
              defaultValue={post?.sort_order ?? 0}
            />
          </Field>
          <div className="flex items-end">
            <div className="w-full">
              <PublishToggle name="published" defaultChecked={post?.published ?? true} label="Tampilkan" />
            </div>
          </div>
        </div>

        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.message}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Menyimpan…" : "Simpan"}
          </Button>
          <Button type="button" variant="outline" onClick={onDone} className="w-full sm:w-auto">
            Batal
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function SocialManager({ posts }: { posts: SocialPost[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {adding ? (
        <SocialForm onDone={() => setAdding(false)} />
      ) : (
        <Button onClick={() => setAdding(true)} className="w-full sm:w-auto">
          <Icon.plus className="h-4 w-4" />
          Tambah konten sosmed
        </Button>
      )}

      {posts.length ? (
        <ul className="space-y-3">
          {posts.map((p) =>
            editingId === p.id ? (
              <li key={p.id}>
                <SocialForm post={p} onDone={() => setEditingId(null)} />
              </li>
            ) : (
              <li key={p.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="maroon">{p.platform}</Badge>
                    <Badge tone={p.published ? "green" : "sand"}>
                      {p.published ? "Tampil" : "Disembunyikan"}
                    </Badge>
                    <span className="text-xs text-sand-500">Urutan {p.sort_order}</span>
                  </div>
                  {p.caption && <p className="mt-2.5 text-sm text-ink">{p.caption}</p>}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block truncate text-xs text-maroon-700 underline underline-offset-2"
                  >
                    {p.url}
                  </a>
                  <div className="mt-4 flex items-center gap-2 border-t border-sand-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(p.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                    >
                      <Icon.edit className="h-4 w-4" />
                      Ubah
                    </button>
                    <span className="ml-auto">
                      <DeleteButton action={deleteSocialPost} id={p.id} />
                    </span>
                  </div>
                </Card>
              </li>
            ),
          )}
        </ul>
      ) : (
        !adding && (
          <EmptyState
            title="Belum ada konten yang dikurasi"
            description="Tempel tautan Instagram atau TikTok yang ingin ditonjolkan di situs."
          />
        )
      )}
    </div>
  );
}
