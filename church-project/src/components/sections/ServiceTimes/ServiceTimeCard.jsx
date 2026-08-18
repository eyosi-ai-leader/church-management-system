// import Link from "next/link";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  ArrowUpRight,
} from "lucide-react";

import {Card} from "@/components/shared/Card";
import Button from "@/components/shared/Button";

export default function ServiceTimeCard({ service }) {
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border
        border-gray-100
        bg-white
        p-8
      "
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-3xl transition-all duration-500 group-hover:bg-blue-100" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">

            <CalendarDays size={24} />

          </div>

          {service.livestream && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              <Radio
                size={12}
                className="animate-pulse"
              />
              LIVE
            </span>
          )}   

          

        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          {service.title}
        </h3>

        <div className="mt-8 space-y-5">

          <div className="flex items-center gap-3">

            <Clock3
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-gray-400">
                Schedule
              </p>

              <p className="font-semibold text-gray-700">
                {service.day} • {service.time}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <MapPin
              size={20}
              className="text-yellow-500"
            />

            <div>

              <p className="text-sm text-gray-400">
                Location
              </p>

              <p className="font-semibold text-gray-700">
                {service.location}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <Button href="/visit">
            Plan Visit
          </Button> 

         <Button
  href={service.map}
  variant="secondary"
  className="flex items-center gap-2"
>
  Map
  <ArrowUpRight size={18} />
</Button>

        </div>

      </div>
    </Card>
  );
}   

