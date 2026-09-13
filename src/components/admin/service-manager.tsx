"use client";

import { useActionState, useEffect, useState } from "react";

import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { Field, Input, Select, Textarea } from "@/components/form-fields";
import { PublishToggle } from "@/components/admin/toggle";
import { submitKeepingValues } from "@/components/admin/submit-keeping-values";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { deleteService, saveService, type ActionState } from "@/app/actions/admin";
import type { Service } from "@/lib/types";

const initial: ActionState = { status: "idle" };

/** Pilihan ikon dibatasi agar tampilan kartu layanan tetap konsisten. */
const iconOptions = [
  { value: "book", label: "Alkitab / ibadah" },
  { value: "users", label: "Kelompok / komsel" },
  { value: "hands", label: "Doa" },
  { value: "heart", label: "Kasih / kunjungan" },
  { value: "gift", label: "Bantuan / diakonia" },
  { value: "spark", label: "Pemuda / lainnya" },
  { value: "shield", label: "Pendampingan" },
  { value: "calendar", label: "Kegiatan terjadwal" },
];

function ServiceForm({ service, onDone }: { service?: Service; onDone: () => void }) {
  const [state, action, pending] = useActionState(saveService, initial);
  const uid = service?.id ?? "baru";

  useEffect(() => {
    if (state.status === "success") onDone();
  }, [state.status, onDone]);

  return (
    <Card className="p-5">
      <form onSubmit={submitKeepingValues(action)} className="space-y-4">
        {service && <input type="hidden" name="id" value={service.id} />}

        <Field label="Nama layanan" htmlFor={`title-${uid}`}>
          <Input id={`title-${uid}`} name="title" defaultValue={service?.title ?? ""} required />
        </Field>

        <Field label="Ringkasan" htmlFor={`summary-${uid}`} hint="Satu-dua kalimat di kartu layanan.">
          <Textarea
            id={`summary-${uid}`}
            name="summary"
            defaultValue={service?.summary ?? ""}
            className="min-h-20"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ikon" htmlFor={`icon-${uid}`}>
            <Select id={`icon-${uid}`} name="icon" defaultValue={service?.icon ?? "heart"}>
              {iconOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Jadwal" htmlFor={`schedule-${uid}`} optional>
            <Input
              id={`schedule-${uid}`}
              name="schedule"
              defaultValue={service?.schedule ?? ""}
              placeholder="Minggu · 09.00 WIB"
            />
          </Field>
          <Field label="Urutan" htmlFor={`order-${uid}`} hint="Angka kecil tampil lebih dulu.">
            <Input
              id={`order-${uid}`}
              name="sort_order"
              type="number"
              inputMode="numeric"
              defaultValue={service?.sort_order ?? 0}
            />
          </Field>
        </div>

        <PublishToggle name="published" defaultChecked={service?.published ?? true} label="Tampilkan" />

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

export function ServiceManager({ services }: { services: Service[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {adding ? (
        <ServiceForm onDone={() => setAdding(false)} />
      ) : (
        <Button onClick={() => setAdding(true)} className="w-full sm:w-auto">
          <Icon.plus className="h-4 w-4" />
          Tambah layanan
        </Button>
      )}

      {services.length ? (
        <ul className="space-y-3">
          {services.map((s) =>
            editingId === s.id ? (
              <li key={s.id}>
                <ServiceForm service={s} onDone={() => setEditingId(null)} />
              </li>
            ) : (
              <li key={s.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={s.published ? "green" : "sand"}>
                      {s.published ? "Tampil" : "Disembunyikan"}
                    </Badge>
                    <span className="text-xs text-sand-500">Urutan {s.sort_order}</span>
                  </div>
                  <h2 className="font-display mt-2.5 text-lg font-semibold text-ink">{s.title}</h2>
                  {s.summary && <p className="mt-1 text-sm text-sand-700">{s.summary}</p>}
                  {s.schedule && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-maroon-600">
                      <Icon.clock className="h-3.5 w-3.5" />
                      {s.schedule}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 border-t border-sand-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(s.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                    >
                      <Icon.edit className="h-4 w-4" />
                      Ubah
                    </button>
                    <span className="ml-auto">
                      <DeleteButton action={deleteService} id={s.id} />
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
            title="Belum ada layanan"
            description="Tambahkan layanan agar halaman Layanan dan beranda terisi."
          />
        )
      )}
    </div>
  );
}
