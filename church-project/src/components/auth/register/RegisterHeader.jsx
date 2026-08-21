import { Church } from "lucide-react";

export default function RegisterHeader() {
  return (
    <div className="mb-8 text-center">
      {/* Brand */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
            <Church size={22} strokeWidth={1.8} />
          </div>

          <div className="text-left">
            <p className="text-sm font-bold tracking-wide text-slate-950">
              FARES CHURCH
            </p>

            <p className="text-xs text-slate-400">
              Church Management Portal
            </p>
          </div>
        </div>
      </div>

      {/* Register Header */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Create your account
      </h1>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Join your church community and get started.
      </p>
    </div>
  );
}