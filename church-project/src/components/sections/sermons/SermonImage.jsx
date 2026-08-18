import Image from "next/image";

const SermonImage = ({ src, alt }) => {
  return (
    <div className="relative aspect-video overflow-hidden bg-gray-100 lg:h-[450px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
          ▶
        </div>
      </div>
    </div>
  );
};

export default SermonImage;