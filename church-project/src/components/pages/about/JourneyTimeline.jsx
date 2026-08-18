import { CalendarDays } from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function JourneyTimeline({ timeline }) {
  return (
    <SectionContainer className="bg-slate-50">
      <SectionHeader
        badge="Our Journey"
        title="Growing Through Every Season"
        description="Every milestone reflects God's faithfulness as our church continues to grow and serve the community."
        align="center"
      />

      <div className="mx-auto mt-20 max-w-4xl">
        <div className="relative">
          <div className="absolute left-6 top-0 h-full w-px bg-slate-200 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="relative flex items-start gap-8 md:grid md:grid-cols-2 md:gap-16"
              >
                <div className="hidden md:block" />

                <div className="absolute left-3 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-lg md:left-1/2 md:-translate-x-1/2">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>

                <div className="ml-12 rounded-3xl bg-white p-8 shadow-sm md:ml-0">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={20}
                      className="text-blue-600"
                    />

                    <span className="font-semibold text-blue-600">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}