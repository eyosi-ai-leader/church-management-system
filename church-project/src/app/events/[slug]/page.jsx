import EventDetailPage from "@/components/pages/events/EventDetailPage";
import { getEventBySlug } from "@/lib/publicEventsApi";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await getEventBySlug(slug);

  if (!data) return { title: "Event" };

  const description = data.description.slice(0, 160);

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      images: data.imageUrl ? [data.imageUrl] : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <EventDetailPage slug={slug} />;
}