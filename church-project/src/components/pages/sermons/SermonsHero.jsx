// src/components/pages/sermons/SermonsHero.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";

export default function SermonsHero({ data }) {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <SectionContainer>
        <div className="py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Sermons
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            {data.title}
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            {data.description}
          </p>
        </div>
      </SectionContainer>
    </section>
  );
}