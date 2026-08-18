// src/app/sermons/page.jsx

import { SermonsPage } from "@/components/pages/sermons";

export const metadata = {
  title: "Sermons | Church Name",
  description:
    "Watch and listen to the latest sermons from our church.",
};

export default function Page() {
  return <SermonsPage />;
}