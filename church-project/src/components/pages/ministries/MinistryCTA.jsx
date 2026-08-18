import Link from "next/link";

import { MessageCircle, ArrowRight } from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import Button from "@/components/shared/Button";

export default function MinistryCTA({ cta }) {
  return (
    <SectionContainer>
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 px-8 py-16 md:px-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <MessageCircle size={36} />
          </div>

          <h2 className="mt-8 text-4xl font-bold md:text-5xl">
            {cta.title}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            {cta.description}
          </p>

          <div className="mt-12">
            <Link href={cta.button.href}>
              <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-700">
                {cta.button.text}

                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}