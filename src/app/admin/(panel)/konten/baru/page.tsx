import { AdminPageHeader } from "@/components/admin/page-header";
import { PostEditor } from "@/components/admin/post-editor";

export default function NewPostPage() {
  return (
    <>
      <AdminPageHeader
        title="Tulisan baru"
        description="Simpan sebagai draf dulu kalau belum siap terbit."
        backHref="/admin/konten"
      />
      <PostEditor />
    </>
  );
}
