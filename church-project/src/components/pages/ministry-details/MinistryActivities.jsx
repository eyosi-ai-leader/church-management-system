import { CheckCircle2 } from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function MinistryActivities({ ministry }) {
  return (
    <SectionContainer className="bg-slate-50">
      <SectionHeader
        subtitle="What We Do"
        title="Ministry Activities"
        description="Discover the different ways this ministry serves our church and community."
        align="center"
      />

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
        {ministry.activities.map((activity) => (
          <div
            key={activity}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <CheckCircle2
              size={22}
              className="mt-1 shrink-0 text-blue-600"
            />

            <p className="text-lg text-slate-700">
              {activity}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}