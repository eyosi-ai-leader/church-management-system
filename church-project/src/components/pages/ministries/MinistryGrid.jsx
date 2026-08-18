import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { MinistryCard } from ".";

export default function MinistryGrid({ ministries }) {
  return (
    <SectionContainer className="bg-slate-50">
      <SectionHeader
        badge="Explore Ministries"
        title="Find a Place to Belong"
        description="Every ministry is an opportunity to grow in your faith, build meaningful relationships, and serve others using your unique gifts."
        align="center"
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {ministries.map((ministry) => (
          <MinistryCard
            key={ministry.id}
            ministry={ministry}
          />
        ))}
      </div>
    </SectionContainer>
  );
}