// src/components/pages/sermons/FeaturedSermon.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";

export default function FeaturedSermon({ data }) {
  return (
    <section className="py-16">
      <SectionContainer>
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div className="aspect-video rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src={data.youtubeUrl}
              title={data.title}
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-sm text-blue-600 font-semibold">
              Featured Sermon
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {data.title}
            </h2>

            <p className="mt-4 text-slate-600">
              {data.description}
            </p>

            <div className="mt-6 text-sm text-slate-500">
              <p>Speaker: {data.speaker}</p>
              <p>Date: {data.date}</p>
            </div>
          </div>

        </div>
      </SectionContainer>
    </section>
  );
}