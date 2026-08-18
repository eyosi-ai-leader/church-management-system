import SermonImage from "./SermonImage";
import SermonContent from "./SermonContent";
import SermonActions from "./SermonActions";

const SermonCard = ({
  title,
  speaker,
  date,
  category,
  description,
  image,
  videoUrl,
  slug,
}) => {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="grid items-center lg:grid-cols-2">

        <div className="overflow-hidden">
          <SermonImage
            src={image}
            alt={title}
          />
        </div>

        <div className="p-8 md:p-10 lg:p-14">
          <SermonContent
            title={title}
            speaker={speaker}
            date={date}
            category={category}
            description={description}
          />

          <div className="mt-8">
            <SermonActions
              videoUrl={videoUrl}
              slug={slug}
            />
          </div>
        </div>

      </div>
    </article>
  );
};

export default SermonCard;