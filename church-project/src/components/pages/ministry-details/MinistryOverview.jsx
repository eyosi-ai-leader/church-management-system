import Image from "next/image";

import { Badge } from "@/components/shared/Badge";
import { SectionContainer } from "@/components/shared/SectionContainer";

export default function MinistryOverview({ ministry }) {
  return (
    <SectionContainer>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={ministry.image}
            alt={ministry.title}
            width={700}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <Badge>About This Ministry</Badge>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            {ministry.title}
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-800">
            {ministry.overview}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}