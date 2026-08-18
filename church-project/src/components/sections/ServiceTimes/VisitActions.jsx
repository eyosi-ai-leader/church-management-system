import Link from "next/link";

import {
  MapPinned,
  Car,
  Coffee,
  CalendarPlus,
  ArrowUpRight,
} from "lucide-react";

import {Card} from "@/components/shared/Card";
import GoogleMapsButton from "./GoogleMapsButton";
import ParkingCard from "./ParkingCard";
import FirstTimeVisitorCard from "./FirstTimeVisitorCard";
import CalendarExportButton from "./CalendarExportButton";

export default function VisitActions() {
  return (
    <section>

      <div className="mb-10 text-center">

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          PLAN YOUR VISIT
        </p>

        <h2 className="mt-3 text-4xl font-bold text-gray-900">
          Everything You Need Before You Arrive
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-gray-500">
          We want your first visit to be comfortable, simple,
          and welcoming.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        <Card className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

            <MapPinned
              size={28}
              className="text-blue-600"
            />

          </div>

          <h3 className="mt-6 text-xl font-bold">
            Directions
          </h3>

          <p className="mt-3 text-gray-500">
            Find our church location using Google Maps.
          </p>

          <Link
            href="https://maps.google.com"
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
          >
            Open Maps
            <ArrowUpRight size={18} />
          </Link>

        </Card>

        <Card className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100">

            <Car
              size={28}
              className="text-yellow-600"
            />

          </div>

          <h3 className="mt-6 text-xl font-bold">
            Parking
          </h3>

          <p className="mt-3 text-gray-500">
            Free parking is available for every worship service.
          </p>

        </Card>

        <Card className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

            <Coffee
              size={28}
              className="text-green-600"
            />

          </div>

          <h3 className="mt-6 text-xl font-bold">
            First Visit
          </h3>

          <p className="mt-3 text-gray-500">
            Meet our welcome team and enjoy free coffee.
          </p>

        </Card>

        <Card className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">

            <CalendarPlus
              size={28}
              className="text-purple-600"
            />

          </div>

          <h3 className="mt-6 text-xl font-bold">
            Calendar
          </h3>

          <p className="mt-3 text-gray-500">
            Save upcoming worship services to your calendar.
          </p>

          <CalendarExportButton />

        </Card>

      </div>

    </section>
  );
}