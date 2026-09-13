"use client";

import { useState } from "react";

import { Button, Card } from "@/components/ui";
import { Field, Input, Textarea } from "@/components/form-fields";
import { updateHelpRequest } from "@/app/actions/admin";
import { HELP_STATUS_LABEL, type HelpRequest, type HelpStatus } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const statuses: HelpStatus[] = ["baru", "diproses", "selesai", "ditutup"];

/** Panel penanganan: ubah status, catat siapa yang menangani, dan tulis catatan. */
export function HelpRequestPanel({ request }: { request: HelpRequest }) {
  const [status, setStatus] = useState<HelpStatus>(request.status);

  return (
    <Card className="p-5 sm:p-6 lg:sticky lg:top-6">
      <h2 className="font-display text-lg font-semibold text-ink">Penanganan</h2>

      <form action={updateHelpRequest} className="mt-4 space-y-4">
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="status" value={status} />

        <div>
          <p className="text-sm font-semibold text-ink">Status</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "min-h-11 rounded-xl border px-3 text-sm font-semibold transition-colors",
                  status === s
                    ? "border-maroon-600 bg-maroon-50 text-maroon-700"
                    : "border-sand-300 text-sand-700 hover:border-maroon-300",
                )}
              >
                {HELP_STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <Field label="Ditangani oleh" htmlFor="handled_by" optional>
          <Input
            id="handled_by"
            name="handled_by"
            defaultValue={request.handled_by ?? ""}
            placeholder="Nama pengurus"
          />
        </Field>

        <Field
          label="Catatan internal"
          htmlFor="admin_notes"
          hint="Hanya terlihat oleh pengurus. Tidak pernah tampil di situs."
          optional
        >
          <Textarea
            id="admin_notes"
            name="admin_notes"
            defaultValue={request.admin_notes ?? ""}
            className="min-h-32"
            placeholder="Sudah dihubungi tanggal…, rencana tindak lanjut…"
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Simpan penanganan
        </Button>
      </form>

      <p className="mt-4 border-t border-sand-200 pt-4 text-xs text-sand-500">
        Terakhir diperbarui {formatDateTime(request.updated_at)}
      </p>
    </Card>
  );
}
