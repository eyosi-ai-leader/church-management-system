import { Suspense } from "react";

import AnnouncementsPage from "@/components/dashboard/announcements/AnnouncementsPage";

export const metadata = {
  title: "Announcements",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AnnouncementsPage />
    </Suspense>
  );
}