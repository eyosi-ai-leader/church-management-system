"use client";

import {
  Search,
  Bell,
  Command,
  Plus,
  ChevronDown,
} from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      {/* Search */}
      <div className="flex items-center">
        <div className="relative hidden w-80 md:block">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            <Command size={10} />
            K
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex">
          <Plus size={15} />
          Quick Action
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="ml-1 h-6 w-px bg-slate-200" />

        <button className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            A
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}