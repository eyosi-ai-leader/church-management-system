import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

const SermonActions = ({
  videoUrl,
  slug,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
      >
        <Play size={18} />

        Watch Sermon
      </a>

      <Link
        href={`/sermons/${slug}`}
        className="group inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
      >
        View Details

        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
};

export default SermonActions;