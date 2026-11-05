import { Suspense } from "react";

import EventsPage from "@/components/dashboard/events/EventsPage";

export const metadata = {
  title: "Events",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EventsPage />
    </Suspense>
  );
}