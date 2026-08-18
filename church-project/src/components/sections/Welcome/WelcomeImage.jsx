
import Image from "next/image";
import DecorativeShape from "./DecorativeShape";
import ScriptureCard from "./ScriptureCard";

export default function WelcomeImage() {
  return (
    <div className="relative w-full lg:w-1/2">
      {/* Decorative Background */}
      <DecorativeShape />

      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
        <Image
          src="/images/welcome/Fares-church.jpg"
          alt="Church members worshipping together"
          fill
          sizes="(max-width:1024px)100vw,50vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Floating Scripture Card */}
      <ScriptureCard />
    </div>
  );
}    

