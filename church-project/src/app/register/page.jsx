import {
  RegisterForm,
  RegisterHeader,
} from "@/components/auth/register";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <section className="w-full max-w-md">
          <RegisterHeader />
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}