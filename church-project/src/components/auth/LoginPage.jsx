import LoginForm from "./LoginForm";
import { Church } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <Church size={22} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-sm font-bold tracking-wide text-slate-950">
                  FARES CHURCH
                </p>

                <p className="text-xs text-slate-400">
                  Church Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Login Header */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage your church community.
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

        </div>
      </section>
    </main>
  );
}