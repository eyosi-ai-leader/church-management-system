import Link from "next/link";
import { ArrowLeft, Church, Megaphone, ShieldCheck, UserRound } from "lucide-react";

import LoginForm from "./LoginForm";

const HIGHLIGHTS = [
  {
    icon: Megaphone,
    text: "Read announcements from your church leaders",
  },
  {
    icon: UserRound,
    text: "Keep your profile and contact details up to date",
  },
  {
    icon: ShieldCheck,
    text: "Secure sign-in with email verification",
  },
];

function Brand({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg ${
          light ? "bg-white text-slate-950" : "bg-slate-950 text-white"
        }`}
      >
        <Church size={22} strokeWidth={1.8} aria-hidden="true" />
      </div>

      <div>
        <p
          className={`text-sm font-bold tracking-wide ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          FARES CHURCH
        </p>

        <p className={`text-xs ${light ? "text-slate-400" : "text-slate-400"}`}>
          Church Management Portal
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel (large screens) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5"
        />

        <div className="relative">
          <Brand light />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Welcome back to your church family.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-300">
            Sign in to stay connected with announcements, your ministries and
            your community.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-200">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <figure className="relative border-l-2 border-white/20 pl-5">
          <blockquote className="text-sm italic leading-6 text-slate-300">
            &ldquo;Behold, how good and how pleasant it is for brethren to
            dwell together in unity!&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-xs font-medium text-slate-400">
            Psalm 133:1 (KJV)
          </figcaption>
        </figure>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Brand />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to your member account to continue.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <LoginForm />
          </div>

          <Link
            href="/"
            className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to the church website
          </Link>
        </div>
      </section>
    </main>
  );
}