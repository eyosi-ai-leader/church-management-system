import Image from "next/image";

const MinistryImage = ({ src, alt, featured = false }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${
        featured
          ? "h-80 md:h-[420px] lg:h-[520px]"
          : "aspect-[4/3]"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={featured}
        sizes={
          featured
            ? "(max-width:1024px) 100vw, 50vw"
            : "(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
};

export default MinistryImage;