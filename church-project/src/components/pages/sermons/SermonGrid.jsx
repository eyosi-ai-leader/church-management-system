// src/components/pages/sermons/SermonGrid.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";
import SermonCard from "./SermonCard";

export default function SermonGrid({ sermons }) {
  return (
    <section className="py-16 bg-slate-50">
      <SectionContainer>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Latest Sermons
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sermons.slice(0, 4).map((sermon, index) => (
            <SermonCard key={index} sermon={sermon} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}