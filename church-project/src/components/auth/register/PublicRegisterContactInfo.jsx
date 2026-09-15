"use client";

export default function PublicRegisterContactInfo({
  formData,
  errors,
  onChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
            <span className="text-red-500">
              {" "}
              *
            </span>
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
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
            value={formData.phone}
            onChange={onChange}
            placeholder="Phone number"
            autoComplete="tel"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Your address"
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.address && (
            <p className="mt-1 text-xs text-red-600">
              {errors.address}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}