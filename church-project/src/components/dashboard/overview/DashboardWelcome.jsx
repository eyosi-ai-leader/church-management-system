import { Activity } from "lucide-react";

export default function DashboardWelcome({ currentDate }) {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-400">
          {currentDate}
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Good morning, Eyosi
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening in your church today.
        </p>
      </div>

      <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
        <Activity size={16} />
        View Activity
      </button>
    </section>
  );
}