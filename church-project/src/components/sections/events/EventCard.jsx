import EventImage from "./EventImage";
import EventContent from "./EventContent";
import EventActions from "./EventActions";

const EventCard = ({
  title,
  category,
  date,
  time,
  location,
  description,
  image,
  slug,
}) => {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="grid items-center lg:grid-cols-2">
        <div className="overflow-hidden">
          <EventImage
            src={image}
            alt={title}
          />
        </div>

        <div className="p-8 md:p-10 lg:p-14">
          <EventContent
            title={title}
            category={category}
            date={date}
            time={time}
            location={location}
            description={description}
          />

          <div className="mt-8">
            <EventActions slug={slug} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default EventCard;