const SermonContent = ({
  title,
  speaker,
  date,
  category,
  description,
}) => {
  return (
    <div className="space-y-6">
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        {category}
      </span>

      <h3 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h3>

      <div className="space-y-2 text-sm font-medium text-gray-600">
        <p>
          <span className="font-semibold text-gray-900">
            Speaker:
          </span>{" "}
          {speaker}
        </p>

        <p>
          <span className="font-semibold text-gray-900">
            Date:
          </span>{" "}
          {date}
        </p>
      </div>

      <p className="max-w-xl text-base leading-8 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default SermonContent;