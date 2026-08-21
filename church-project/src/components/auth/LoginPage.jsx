import LoginBrand from "./LoginBrand";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* <LoginBrand /> */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-indigo-600">
                Church Management Portal
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to manage your church community.
              </p>
            </div>

            <LoginForm />

          </div>
        </section>

      </div>
    </main>
  );
}