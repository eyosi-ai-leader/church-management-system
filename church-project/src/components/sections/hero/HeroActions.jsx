import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/shared/Button";

const HeroActions = () => {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-6">
      <Button href="/contact" variant="primary" className="shadow-soft">
        Plan Your Visit
      </Button>

      <Link
        href="/sermons"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        Watch Our Sermons
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default HeroActions;