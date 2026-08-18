import MinistryImage from "./MinistryImage";
import MinistryContent from "./MinistryContent";
import MinistryActions from "./MinistryActions";

const FeaturedMinistry = ({
  title,
  description,
  category,
  image,
  slug,
}) => {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="grid lg:grid-cols-2">
        <div className="overflow-hidden">
          <MinistryImage
            src={image}
            alt={title}
            featured
          />
        </div>

        <div className="flex flex-col justify-center p-8 md:p-10 lg:p-14">
          <span className="mb-5 inline-flex w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Featured Ministry
          </span>

          <MinistryContent
            title={title}
            description={description}
            category={category}
            featured
          />

          <div className="mt-10">
            <MinistryActions slug={slug} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedMinistry;