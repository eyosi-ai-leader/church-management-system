import {
  ArrowUpRight,
  CalendarDays,
  Users,
  Church,
} from "lucide-react";

export default function LoginBrand() {
  return (
    <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.28),_transparent_45%)]" />

      <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
              <Church size={22} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                FARES CHURCH
              </p>

              <p className="text-xs text-slate-400">
                Church Management Portal
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-xl py-16">

          <p className="mb-5 text-sm font-medium text-indigo-300">
            Everything your church needs
          </p>

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Manage your church.
            <br />
            Serve your people.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            A modern workspace for managing members, ministries,
            events, and the life of your church community.
          </p>

          {/* Feature cards */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Users
                size={19}
                className="text-indigo-300"
              />

              <p className="mt-4 text-xs font-semibold text-white">
                Members
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Manage people
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Church
                size={19}
                className="text-indigo-300"
              />

              <p className="mt-4 text-xs font-semibold text-white">
                Ministries
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Serve together
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <CalendarDays
                size={19}
                className="text-indigo-300"
              />

              <p className="mt-4 text-xs font-semibold text-white">
                Events
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Stay organized
              </p>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm italic text-slate-400">
              “Serve one another in love.”
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Galatians 5:13
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400">
            <ArrowUpRight size={17} />
          </div>

        </div>

      </div>
    </section>
  );
}