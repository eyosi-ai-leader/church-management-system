import Link from "next/link";

import { ArrowRight, CalendarDays } from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import  Button  from "@/components/shared/Button";

export default function JoinCommunity({ cta }) {
  return (
    <SectionContainer>
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 px-8 py-16 text-center text-white md:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold md:text-5xl">
            {cta.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            {cta.description}
          </p>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
  <Link href={cta.primaryButton.href}>
    <Button
      className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
    >
      {cta.primaryButton.text}

      <ArrowRight size={18} />
    </Button>
  </Link>

  <Link href={cta.secondaryButton.href}>
    <Button
      className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
    >
      <CalendarDays size={18} />

      {cta.secondaryButton.text}
    </Button>
  </Link>
</div>
        </div>
      </div>
    </SectionContainer>
  );
}