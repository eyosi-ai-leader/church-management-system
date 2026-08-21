const growthData = [
  { month: "Jan", value: 58 },
  { month: "Feb", value: 64 },
  { month: "Mar", value: 61 },
  { month: "Apr", value: 72 },
  { month: "May", value: 76 },
  { month: "Jun", value: 82 },
  { month: "Jul", value: 88 },
  { month: "Aug", value: 94 },
];

export default function MemberGrowth() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Member Growth
          </p>

          <div className="mt-1 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              1,248
            </h2>

            <span className="text-xs font-semibold text-emerald-600">
              +12.4%
            </span>
          </div>
        </div>

        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
          Last 8 months
        </button>
      </div>

      <div className="mt-8">
        <div className="flex h-56 items-end gap-3 sm:gap-5">
          {growthData.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div className="relative flex h-full items-end">
                <div
                  className="w-full rounded-t-lg bg-slate-900 transition hover:bg-slate-700"
                  style={{ height: `${item.value}%` }}
                />
              </div>

              <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                {item.month}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}