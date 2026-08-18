import { sermons } from "@/data/sermons";

import SermonCard from "./SermonCard";

const LatestSermon = () => {
  const latestSermon = sermons.find(
    (sermon) => sermon.featured
  );

  if (!latestSermon) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
            Latest Sermon
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Watch our latest message
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Stay connected with our latest teachings and discover messages that encourage faith, hope, and spiritual growth.
          </p>
        </div>

        <SermonCard
          title={latestSermon.title}
          speaker={latestSermon.speaker}
          date={latestSermon.date}
          category={latestSermon.category}
          description={latestSermon.description}
          image={latestSermon.image}
          videoUrl={latestSermon.videoUrl}
          slug={latestSermon.slug}
        />
      </div>
    </section>
  );
};

export default LatestSermon;