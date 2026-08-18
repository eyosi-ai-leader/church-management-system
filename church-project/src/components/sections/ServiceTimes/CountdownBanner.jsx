"use client";

import { CalendarDays, Clock } from "lucide-react";

import Button from "@/components/shared/Button";
import serviceTimes from "@/data/serviceTimes";
import useCountdown from "@/hooks/useCountdown";

export default function CountdownBanner() {
  // Get the featured service
  const nextService = serviceTimes.find((service) => service.featured);

  // Countdown values
  const { days, hours, minutes, seconds } = useCountdown(
    nextService?.nextServiceDate
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-12 text-white shadow-2xl">
      {/* Background Effects */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            <CalendarDays size={18} />
            Next Worship Service
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            {nextService?.title}
          </h2>

          <p className="mt-4 text-blue-100">
            Join us on <strong>{nextService?.day}</strong> at{" "}
            <strong>{nextService?.time}</strong>.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <TimeBox value={days} label="Days" />
            <TimeBox value={hours} label="Hours" />
            <TimeBox value={minutes} label="Minutes" />
            <TimeBox value={seconds} label="Seconds" />
          </div>

          <Button href="/contact">
            Plan Your Visit
          </Button>
        </div>
      </div>
    </section>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
      <Clock
        size={18}
        className="mb-2 text-yellow-300"
      />

      <h3 className="text-3xl font-bold">
        {String(value).padStart(2, "0")}
      </h3>

      <p className="text-sm text-blue-100">
        {label}
      </p>
    </div>
  );
}