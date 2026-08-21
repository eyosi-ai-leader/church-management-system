import {
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function AIInsight() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Sparkles size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                Church AI Insight
              </p>

              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-300">
                AI
              </span>
            </div>

            <h3 className="mt-1 text-lg font-semibold">
              Member participation is trending upward.
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
              Member activity has increased this month. Explore your
              church data to discover which areas are growing fastest.
            </p>
          </div>
        </div>

        <button className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
          Explore Insights
          <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}