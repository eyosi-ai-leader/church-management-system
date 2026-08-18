const MinistryContent = ({
  title,
  description,
  category,
  featured = false,
}) => {
  return (
    <div className={featured ? "space-y-6" : "space-y-4"}>
      <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {category}
      </span>

      <h3
        className={`font-bold tracking-tight text-gray-900 ${
          featured
            ? "text-3xl leading-tight md:text-4xl"
            : "text-2xl leading-snug"
        }`}
      >
        {title}
      </h3>

      <p
        className={`leading-8 text-gray-600 ${
          featured
            ? "max-w-xl text-lg"
            : "text-base"
        }`}
      >
        {description}
      </p>
    </div>
  );
};

export default MinistryContent;