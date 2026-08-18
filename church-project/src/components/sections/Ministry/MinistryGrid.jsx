import MinistryCard from "./MinistryCard";

const MinistryGrid = ({ ministries }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {ministries.map((ministry) => (
        <MinistryCard
          key={ministry.id}
          title={ministry.title}
          description={ministry.description}
          category={ministry.category}
          image={ministry.image}
          slug={ministry.slug}
        />
      ))}
    </div>
  );
};

export default MinistryGrid;