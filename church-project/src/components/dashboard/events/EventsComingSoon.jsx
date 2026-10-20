"use client";

import {
  CalendarDays,
  Clock3,
  UsersRound,
  BellRing,
  ArrowUpRight,
  Sparkles,
  CalendarCheck2,
  CalendarPlus,
  CheckCircle2,
} from "lucide-react";

const plannedFeatures = [
  {
    icon: CalendarPlus,
    title: "Event scheduling",
    description:
      "Create church services, conferences, gatherings, and special programs.",
  },
  {
    icon: UsersRound,
    title: "Member participation",
    description:
      "Organize attendees and help members stay connected with church activities.",
  },
  {
    icon: BellRing,
    title: "Event announcements",
    description:
      "Keep your congregation informed about upcoming dates and important updates.",
  },
];

export default function EventsComingSoon() {
  return (
    <div className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Church Management
              <span className="text-slate-300">/</span>
              <span className="text-slate-700">Events</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Events
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              A central place to plan church gatherings, coordinate
              activities, and keep everyone informed.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            In development
          </span>
        </header>

        {/* Main coming soon panel */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 -z-10 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
            {/* Main message */}
            <div className="max-w-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                <CalendarDays className="h-7 w-7" strokeWidth={1.7} />
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Something meaningful is coming
              </div>

              <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Bringing your church
                <span className="block text-blue-600">
                  together.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                The Events module is being prepared to make planning
                and coordinating church activities simpler. Once
                available, you will be able to manage events and keep
                your congregation up to date from one place.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                  <Clock3 className="h-4 w-4" />
                  Coming soon
                </div>

                <span className="text-xs font-medium text-slate-500">
                  No events have been published yet.
                </span>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Designed for your church
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Ready to grow as your church's needs evolve.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative calendar preview */}
            <div className="mx-auto w-full max-w-md">
              <div className="rotate-1 rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      YOUR CHURCH
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Event calendar
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
                  {["M", "T", "W", "T", "F", "S", "S"].map(
                    (day, index) => (
                      <div
                        key={`${day}-${index}`}
                        className="py-2 text-[10px] font-bold text-slate-400 sm:text-xs"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {Array.from({ length: 35 }, (_, index) => {
                    const dayNumber = index - 1;
                    const isCurrentDay = dayNumber === 18;

                    return (
                      <div
                        key={index}
                        className={`relative flex aspect-square items-center justify-center rounded-xl text-xs font-medium ${
                          dayNumber < 1 || dayNumber > 31
                            ? "text-slate-200"
                            : isCurrentDay
                              ? "bg-slate-900 font-bold text-white shadow-md"
                              : "text-slate-600"
                        }`}
                      >
                        {dayNumber < 1
                          ? 30 + dayNumber
                          : dayNumber > 31
                            ? dayNumber - 31
                            : dayNumber}

                        {isCurrentDay && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <CalendarPlus className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Your next gathering
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Event scheduling will appear here when the
                        module becomes available.
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-500" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <UsersRound className="h-4 w-4 text-slate-400" />
                    Congregation
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                    Future feature
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Calendar preview · Illustrative only
              </p>
            </div>
          </div>
        </section>

        {/* Planned capabilities */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              What to expect
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The features planned for the Events module.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plannedFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      Planned
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your existing dashboard remains unchanged
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This is a presentation-only preview. Event creation,
              scheduling, registrations, and notifications can be
              connected when the real Events module is implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
