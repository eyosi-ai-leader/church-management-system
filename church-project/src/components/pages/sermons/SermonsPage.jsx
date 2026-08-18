// src/components/pages/sermons/SermonsPage.jsx

import SermonsHero from "./SermonsHero";
import FeaturedSermon from "./FeaturedSermon";
import SermonGrid from "./SermonGrid";
import SermonCTA from "./SermonCTA";

import { sermonsPage } from "@/data/sermonsPage";

export default function SermonsPage() {
  return (
    <main>
      <SermonsHero data={sermonsPage.hero} />

      <FeaturedSermon data={sermonsPage.featured} />

      <SermonGrid sermons={sermonsPage.sermons} />

      <SermonCTA data={sermonsPage.cta} />
    </main>
  );
}