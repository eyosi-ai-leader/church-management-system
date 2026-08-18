import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MinistryActions = ({ slug }) => {
  return (
    <Link
      href={`/ministries/${slug}`}
      className="group inline-flex items-center gap-2 bg-blue-700 text-white rounded-full border border-primary/15 bg-primary px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
    >
      Learn More

      <ArrowRight
        size={18}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
};

export default MinistryActions;