import Link from "next/link";
import { MapPinned, ArrowUpRight } from "lucide-react";

export default function GoogleMapsButton({
  href = "https://maps.google.com",
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-xl
      "
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <MapPinned size={28} />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Google Maps
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Get directions to our church.
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={22}
        className="text-blue-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </Link>
  );
}