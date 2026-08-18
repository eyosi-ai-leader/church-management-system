import {
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/shared/Card";
import Button from "@/components/shared/Button";

import serviceTimes from "@/data/serviceTimes";

export default function NextServiceCard() {
  const nextService = serviceTimes.find(
    (service) => service.featured
  );

  if (!nextService) return null;

  return (
    <Card className="border border-blue-100 bg-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Next Service
          </span>

          <h3 className="mt-4 text-3xl font-bold text-gray-900">
            {nextService.title}
          </h3>

          <p className="mt-2 text-gray-500">
            We can't wait to worship with you.
          </p>
        </div> 
        
{nextService.livestream && nextService.liveUrl && (
  <a
    href={nextService.liveUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="
      inline-flex
      rounded-2xl
      bg-red-50
      px-4
      py-2
      transition-all
      duration-300
      hover:bg-red-100
      hover:shadow-md
      hover:scale-105
      cursor-pointer
    "
  >
    <div className="flex items-center gap-2 text-red-600">
      <Radio
        size={16}
        className="animate-pulse"
      />

      <span className="text-sm font-semibold">
        LIVE STREAM AVAILABLE
      </span>
    </div>
  </a>
)} 
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <CalendarDays className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-400">
              Day
            </p>

            <p className="font-semibold">
              {nextService.day}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock3 className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-400">
              Time
            </p>

            <p className="font-semibold">
              {nextService.time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-yellow-500" />

          <div>
            <p className="text-sm text-gray-400">
              Location
            </p>

            <p className="font-semibold">
              {nextService.location}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/visit">
          Plan Visit
        </Button>

        {nextService.livestream && nextService.liveUrl && (
          <Button
            href={nextService.liveUrl}
            className="flex items-center gap-2"
          >
            Watch Live
            <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </Card>
  );
}