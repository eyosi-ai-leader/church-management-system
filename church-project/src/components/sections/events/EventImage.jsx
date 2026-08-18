import Image from "next/image";

const EventImage = ({ src, alt }) => {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 lg:h-[480px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
};

export default EventImage;