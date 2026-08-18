import MinistryImage from "./MinistryImage";
import MinistryContent from "./MinistryContent";
import MinistryActions from "./MinistryActions";

const MinistryCard = ({
  title,
  description,
  category,
  image,
  slug,
}) => {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
      <MinistryImage
        src={image}
        alt={title}
      />

      <div className="flex flex-col p-7">
        <MinistryContent
          title={title}
          description={description}
          category={category}
        />

        <div className="mt-8">
          <MinistryActions slug={slug} />
        </div>
      </div>
    </article>
  );
};

export default MinistryCard;