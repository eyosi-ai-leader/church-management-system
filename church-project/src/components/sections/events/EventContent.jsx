const EventContent = ({
  title,
  category,
  date,
  time,
  location,
  description,
}) => {
  return (
    <div className="space-y-6">
      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {category}
      </span>

      <h3 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h3>

      <div className="space-y-2 text-sm font-medium text-gray-600">
        <p>
          <span className="font-semibold text-gray-900">
            Date:
          </span>{" "}
          {date}
        </p>

        <p>
          <span className="font-semibold text-gray-900">
            Time:
          </span>{" "}
          {time}
        </p>

        <p>
          <span className="font-semibold text-gray-900">
            Location:
          </span>{" "}
          {location}
        </p>
      </div>

      <p className="max-w-xl text-base leading-8 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default EventContent;