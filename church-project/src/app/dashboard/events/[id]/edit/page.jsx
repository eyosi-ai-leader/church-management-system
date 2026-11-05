import EventEditor from "@/components/dashboard/events/EventEditor";

export const metadata = {
  title: "Edit event",
};

export default async function Page({ params }) {
  const { id } = await params;

  return <EventEditor eventId={id} />;
}