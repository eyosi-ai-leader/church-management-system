import { Suspense } from "react";
import { Church } from "lucide-react";
import VerifyEmailForm from "./VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
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

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Verify your email
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the 6-digit code we sent to your email.
            </p>
          </div>

          <Suspense fallback={null}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}