import {
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <button className="text-slate-300 transition hover:text-slate-600">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="mt-1 flex items-end gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <span className="mb-1 inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
            <ArrowUpRight size={13} />
            {change}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}