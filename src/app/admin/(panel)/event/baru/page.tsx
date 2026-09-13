import { AdminPageHeader } from "@/components/admin/page-header";
import { EventEditor } from "@/components/admin/event-editor";

export default function NewEventPage() {
  return (
    <>
      <AdminPageHeader title="Event baru" backHref="/admin/event" />
      <EventEditor />
    </>
  );
}
