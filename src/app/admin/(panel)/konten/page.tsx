import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { Badge, ButtonLink, Card, EmptyState } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import { deletePost, togglePost } from "@/app/actions/admin";
import { POST_CATEGORY_LABEL, type Post } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminKontenPage() {
  const supabase = await adminDb();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as Post[];

  return (
    <>
      <AdminPageHeader
        title="Tulisan"
        description="Renungan, artikel, berita, dan kesaksian yang tampil di halaman Konten."
        action={
          <ButtonLink href="/admin/konten/baru">
            <Icon.plus className="h-4 w-4" />
            Tulisan baru
          </ButtonLink>
        }
      />

      {posts.length ? (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Card className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={p.published ? "green" : "sand"}>
                    {p.published ? "Terbit" : "Draf"}
                  </Badge>
                  <Badge tone="maroon">{POST_CATEGORY_LABEL[p.category]}</Badge>
                  <span className="text-xs text-sand-500">
                    Diperbarui {formatDateShort(p.updated_at)}
                  </span>
                </div>

                <h2 className="font-display mt-2.5 text-lg font-semibold leading-snug text-ink">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-sand-700">{p.excerpt}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-3">
                  <Link
                    href={`/admin/konten/${p.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                  >
                    <Icon.edit className="h-4 w-4" />
                    Ubah
                  </Link>

                  <form action={togglePost}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="next" value={p.published ? "false" : "true"} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-sand-700 transition-colors hover:bg-sand-100"
                    >
                      {p.published ? "Jadikan draf" : "Terbitkan"}
                    </button>
                  </form>

                  {p.published && (
                    <Link
                      href={`/konten/${p.slug}`}
                      target="_blank"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-sand-700 transition-colors hover:bg-sand-100"
                    >
                      <Icon.arrowUpRight className="h-4 w-4" />
                      Lihat
                    </Link>
                  )}

                  <span className="ml-auto">
                    <DeleteButton action={deletePost} id={p.id} />
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Belum ada tulisan"
          description="Mulai dengan renungan pertama. Anda bisa menyimpannya sebagai draf dulu."
          action={
            <ButtonLink href="/admin/konten/baru">
              <Icon.plus className="h-4 w-4" />
              Buat tulisan pertama
            </ButtonLink>
          }
        />
      )}
    </>
  );
}
