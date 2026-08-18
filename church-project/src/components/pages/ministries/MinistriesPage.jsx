import ministriesPage from "@/data/ministriesPage";

import {
  MinistriesHero,
  MinistryIntroduction,
  MinistryGrid,
  MinistryCTA,
} from ".";

export default function MinistriesPage() {
  return (
    <>
      <MinistriesHero hero={ministriesPage.hero} />

      <MinistryIntroduction
        introduction={ministriesPage.introduction}
      />

      <MinistryGrid
        ministries={ministriesPage.ministries}
      />

      <MinistryCTA
        cta={ministriesPage.cta}
      />
    </>
  );
}