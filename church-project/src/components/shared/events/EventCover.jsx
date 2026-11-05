import { CalendarDays } from "lucide-react";

export default function EventCover({ src, alt, className = "" }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300"
    >
      <CalendarDays className="h-14 w-14" strokeWidth={1.4} aria-hidden="true" />
    </div>
  );
}