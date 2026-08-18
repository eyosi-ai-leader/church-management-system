import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
      aria-label="Church Platform Home"
    >
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-ink">
        <Image
          src="/images/Fares-logo.jpg"
          alt="Church Logo"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-sm font-medium text-ink">Fares church</span>
    </Link>
  );
};

export default Logo;