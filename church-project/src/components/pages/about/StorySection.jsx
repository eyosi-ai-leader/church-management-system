import Image from "next/image";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { Badge } from "@/components/shared/Badge";
import { StoryStats } from ".";

export default function StorySection({ story }) {
  return (
    <SectionContainer>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={story.image}
              alt={story.title}
              width={700}
              height={850}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-8 left-1/2 w-[92%] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
            <StoryStats stats={story.stats} />
          </div>
        </div>

        <div className="space-y-8">
          <Badge variant="primary">{story.eyebrow}</Badge>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
              {story.title}
            </h2>

            {story.description.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-8 text-slate-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}