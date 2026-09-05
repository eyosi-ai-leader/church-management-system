"use client";

export default function MemberContactInfo({
  form,
  errors,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Contact details and address information.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="member@example.com"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="0911 000 000"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            rows={3}
            placeholder="Enter member address"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </div>
  );
}