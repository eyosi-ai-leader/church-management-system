// src/components/pages/sermons/SermonCTA.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";
import Button from "@/components/shared/Button";

export default function SermonCTA({ data }) {
  return (
    <section className="py-16">
      <SectionContainer>
        <div className="rounded-3xl bg-blue-50 p-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.title}
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {data.description}
          </p>

          <div className="mt-6">
            <Button href="/contact">
              Visit Us
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}