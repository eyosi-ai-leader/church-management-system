import Image from "next/image";
import DecorativeShape from "./DecorativeShape";
import MissionCard from "./MissionCard";

export default function AboutImage() {
  return (
    <div className="relative w-full lg:w-1/2">
      <DecorativeShape />

      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
        <Image
          src="/images/about/Fares-Pray-2.jpg"
          alt="Church congregation worshipping together"
          fill
          sizes="(max-width:1024px)100vw,50vw"
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>

      <MissionCard />
    </div>
  );
}