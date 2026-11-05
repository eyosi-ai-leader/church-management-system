import EventCover from "@/components/shared/events/EventCover";

const EventImage = ({ src, alt }) => {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 lg:h-[480px]">
      <EventCover
        src={src}
        alt={alt}
        className="transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
};

export default EventImage;