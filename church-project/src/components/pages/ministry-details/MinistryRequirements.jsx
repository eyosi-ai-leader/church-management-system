import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/shared/Card";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function MinistryRequirements({ ministry }) {
  return (
    <SectionContainer>
      <SectionHeader
        badge="Requirements"
        title="Who Can Join?"
        description="Everyone is welcome to explore serving in this ministry. These expectations help us build healthy and effective teams."
        align="center"
      />

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
        {ministry.requirements.map((requirement) => (
          <Card
            key={requirement}
            className="flex items-start gap-4 rounded-3xl border border-slate-200 p-6"
          >
            <CheckCircle2
              size={22}
              className="mt-1 shrink-0 text-blue-600"
            />

            <p className="leading-7 text-slate-700">
              {requirement}
            </p>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}