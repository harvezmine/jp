import { AdminPageHeader } from "@/components/admin/page-header";
import { SocialManager } from "@/components/admin/social-manager";
import { adminDb } from "@/lib/admin-auth";
import type { SocialPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSosmedPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("social_posts").select("*").order("sort_order");

  return (
    <>
      <AdminPageHeader
        title="Konten Sosmed"
        description="Kurasi manual konten Instagram dan TikTok yang ingin ditampilkan di situs."
      />
      <SocialManager posts={(data ?? []) as SocialPost[]} />
    </>
  );
}
