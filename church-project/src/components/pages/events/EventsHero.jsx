import { PageHero } from "@/components/shared/PageHero";
import { eventsPage } from "@/data/eventsPage";

export default function EventsHero() {
  return (
    <PageHero
      eyebrow={eventsPage.hero.eyebrow}
      title={eventsPage.hero.title}
      description={eventsPage.hero.description}
      image={eventsPage.hero.image}
      breadcrumb={[
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Events",
        },
      ]}
    />
  );
}