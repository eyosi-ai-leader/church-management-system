import Image from "next/image";

import { Badge } from "@/components/shared/Badge";
import { SectionContainer } from "@/components/shared/SectionContainer";

export default function MinistryLeader({ ministry }) {
  return (
    <SectionContainer className="bg-slate-50">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Badge>Ministry Leader</Badge>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            Meet Our Leader
          </h2>

          <h3 className="mt-8 text-2xl font-semibold text-blue-600">
            {ministry.leader.name}
          </h3>

          <p className="mt-2 text-slate-500">
            {ministry.leader.role}
          </p>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            {ministry.leader.bio}
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src={ministry.leader.image}
              alt={ministry.leader.name}
              width={650}
              height={750}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}