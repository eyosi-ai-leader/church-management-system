import { ministries } from "@/data/ministries";

import { SectionHeader } from "@/components/shared/SectionHeader";
import FeaturedMinistry from "./FeaturedMinistry";
import MinistryGrid from "./MinistryGrid";

const Ministries = () => {
  const featuredMinistry = ministries.find(
    (ministry) => ministry.featured
  );

  const otherMinistries = ministries.filter(
    (ministry) => !ministry.featured
  );

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Our Ministries"
          title="Find Your Place to Belong, Grow, and Serve"
          description="Discover meaningful opportunities to worship, build relationships, and make a lasting impact through the ministries of our church."
        />

        <div className="mt-16">
          {featuredMinistry && (
            <FeaturedMinistry
              title={featuredMinistry.title}
              description={featuredMinistry.description}
              category={featuredMinistry.category}
              image={featuredMinistry.image}
              slug={featuredMinistry.slug}
            />
          )}

          <div className="mt-10">
            <MinistryGrid ministries={otherMinistries} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ministries;