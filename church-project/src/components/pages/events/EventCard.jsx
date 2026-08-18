import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import { Card } from "@/components/shared/Card";

export default function EventCard({ event }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-5 p-6">
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">
          {event.category}
        </span>

        <h3 className="text-2xl font-bold text-slate-900">
          {event.title}
        </h3>

        <p className="leading-7 text-slate-600">
          {event.description}
        </p>

        <div className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}