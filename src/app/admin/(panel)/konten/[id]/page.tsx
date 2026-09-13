import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { PostEditor } from "@/components/admin/post-editor";
import { adminDb } from "@/lib/admin-auth";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <>
      <AdminPageHeader title="Ubah tulisan" backHref="/admin/konten" />
      <PostEditor post={data as Post} />
    </>
  );
}
