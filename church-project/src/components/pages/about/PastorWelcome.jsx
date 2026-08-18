import Image from "next/image";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { Badge } from "@/components/shared/Badge";

export default function PastorWelcome({ pastor }) {
  return (
    <SectionContainer>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src={pastor.image}
              alt={pastor.name}
              width={650}
              height={750}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <Badge>Pastor's Welcome</Badge>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            A Message From Our Pastor
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            {pastor.message}
          </p>

          <div className="mt-10 border-l-4 border-blue-600 pl-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {pastor.name}
            </h3>

            <p className="mt-1 text-slate-500">
              {pastor.role}
            </p>

            <p className="mt-6 text-lg font-semibold italic text-blue-600">
              {pastor.signature}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}