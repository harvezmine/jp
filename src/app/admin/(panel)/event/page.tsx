import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { Badge, ButtonLink, Card, EmptyState } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import { deleteEvent } from "@/app/actions/admin";
import type { JPEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEventPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: false });
  const events = (data ?? []) as JPEvent[];

  return (
    <>
      <AdminPageHeader
        title="Event"
        description="Jadwal kegiatan yang tampil di halaman Event dan beranda."
        action={
          <ButtonLink href="/admin/event/baru">
            <Icon.plus className="h-4 w-4" />
            Event baru
          </ButtonLink>
        }
      />

      {events.length ? (
        <ul className="space-y-3">
          {events.map((e) => {
            const past = new Date(e.starts_at).getTime() < Date.now();
            return (
              <li key={e.id}>
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={e.published ? "green" : "sand"}>
                      {e.published ? "Terbit" : "Draf"}
                    </Badge>
                    {past && <Badge tone="sand">Sudah lewat</Badge>}
                    <span className="text-xs text-sand-500">{formatDateTime(e.starts_at)}</span>
                  </div>

                  <h2 className="font-display mt-2.5 text-lg font-semibold text-ink">{e.title}</h2>
                  {e.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-sand-700">
                      <Icon.pin className="h-3.5 w-3.5 text-sand-500" />
                      {e.location}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-3">
                    <Link
                      href={`/admin/event/${e.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                    >
                      <Icon.edit className="h-4 w-4" />
                      Ubah
                    </Link>
                    {e.published && (
                      <Link
                        href={`/event/${e.slug}`}
                        target="_blank"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-sand-700 hover:bg-sand-100"
                      >
                        <Icon.arrowUpRight className="h-4 w-4" />
                        Lihat
                      </Link>
                    )}
                    <span className="ml-auto">
                      <DeleteButton action={deleteEvent} id={e.id} />
                    </span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="Belum ada event"
          description="Tambahkan kegiatan pertama agar muncul di halaman Event."
          action={
            <ButtonLink href="/admin/event/baru">
              <Icon.plus className="h-4 w-4" />
              Buat event
            </ButtonLink>
          }
        />
      )}
    </>
  );
}
