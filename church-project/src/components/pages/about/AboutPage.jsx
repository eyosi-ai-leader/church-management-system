import aboutPage from "@/data/aboutPage";

import { PageHero } from "@/components/shared/PageHero";

import {
  StorySection,
  MissionVisionValues,
  PastorWelcome,
  JourneyTimeline,
  LeadershipPreview,
  JoinCommunity,
} from ".";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={aboutPage.hero.title}
        description={aboutPage.hero.description}
        image={aboutPage.hero.image}
        breadcrumb={aboutPage.hero.breadcrumb}
      />

      <StorySection story={aboutPage.story} />

      <MissionVisionValues
        items={aboutPage.missionVisionValues}
      />

      <PastorWelcome
        pastor={aboutPage.pastor}
      />

      <JourneyTimeline
        timeline={aboutPage.timeline}
      />

      <LeadershipPreview
        leadership={aboutPage.leadership}
      />

      <JoinCommunity
        cta={aboutPage.cta}
      />
    </>
  );
}