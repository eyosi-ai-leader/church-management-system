// src/components/pages/contact/ContactHero.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";

export default function ContactHero({ data }) {
  return (
    <section className="bg-slate-50 py-20">
      <SectionContainer>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Contact Us
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