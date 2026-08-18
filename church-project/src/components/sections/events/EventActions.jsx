import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EventActions = ({ slug }) => {
  return (
   <Link
  href={`/events/${slug}`}
  className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
>
  View Event

  <ArrowRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>
  );
};

export default EventActions;