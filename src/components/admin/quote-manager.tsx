"use client";

import { useActionState, useEffect, useState } from "react";

import { Button, Badge, Card, EmptyState } from "@/components/ui";
import { Field, Input, Textarea } from "@/components/form-fields";
import { PublishToggle } from "@/components/admin/toggle";
import { submitKeepingValues } from "@/components/admin/submit-keeping-values";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { deleteQuote, saveQuote, type ActionState } from "@/app/actions/admin";
import type { Quote } from "@/lib/types";

const initial: ActionState = { status: "idle" };

function QuoteForm({ quote, onDone }: { quote?: Quote; onDone: () => void }) {
  const [state, action, pending] = useActionState(saveQuote, initial);

  useEffect(() => {
    if (state.status === "success") onDone();
  }, [state.status, onDone]);

  return (
    <Card className="p-5">
      <form onSubmit={submitKeepingValues(action)} className="space-y-4">
        {quote && <input type="hidden" name="id" value={quote.id} />}

        <Field label="Isi kutipan" htmlFor={`content-${quote?.id ?? "baru"}`}>
          <Textarea
            id={`content-${quote?.id ?? "baru"}`}
            name="content"
            defaultValue={quote?.content ?? ""}
            className="min-h-28"
            placeholder="Tuliskan ayat atau kalimat yang ingin dibagikan…"
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Referensi ayat" htmlFor={`ref-${quote?.id ?? "baru"}`} optional>
            <Input
              id={`ref-${quote?.id ?? "baru"}`}
              name="reference"
              defaultValue={quote?.reference ?? ""}
              placeholder="Yeremia 29:11"
            />
          </Field>
          <Field label="Penulis" htmlFor={`author-${quote?.id ?? "baru"}`} optional>
            <Input
              id={`author-${quote?.id ?? "baru"}`}
              name="author"
              defaultValue={quote?.author ?? ""}
              placeholder="Kosongkan bila dari Alkitab"
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PublishToggle name="published" defaultChecked={quote?.published ?? true} label="Tampilkan" />
          <PublishToggle
            name="featured"
            defaultChecked={quote?.featured ?? false}
            label="Tampilkan di beranda"
          />
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

export function QuoteManager({ quotes }: { quotes: Quote[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {adding ? (
        <QuoteForm onDone={() => setAdding(false)} />
      ) : (
        <Button onClick={() => setAdding(true)} className="w-full sm:w-auto">
          <Icon.plus className="h-4 w-4" />
          Tambah kutipan
        </Button>
      )}

      {quotes.length ? (
        <ul className="space-y-3">
          {quotes.map((q) =>
            editingId === q.id ? (
              <li key={q.id}>
                <QuoteForm quote={q} onDone={() => setEditingId(null)} />
              </li>
            ) : (
              <li key={q.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={q.published ? "green" : "sand"}>
                      {q.published ? "Tampil" : "Disembunyikan"}
                    </Badge>
                    {q.featured && <Badge tone="gold">Beranda</Badge>}
                  </div>

                  <blockquote className="font-display mt-3 text-lg leading-snug text-ink">
                    {q.content}
                  </blockquote>
                  {(q.reference || q.author) && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-maroon-600">
                      {q.reference ?? q.author}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-sand-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(q.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                    >
                      <Icon.edit className="h-4 w-4" />
                      Ubah
                    </button>
                    <span className="ml-auto">
                      <DeleteButton action={deleteQuote} id={q.id} />
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
            title="Belum ada kutipan"
            description="Kutipan yang ditandai “Beranda” akan tampil di halaman utama."
          />
        )
      )}
    </div>
  );
}
