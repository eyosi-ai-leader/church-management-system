"use client";

export default function PublicRegisterChurchInfo({
  formData,
  errors,
  onChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Church Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your church membership
          information.
        </p>
      </div>

      <div className="max-w-md">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Baptism date
        </label>

        <input
          type="date"
          name="baptismDate"
          value={formData.baptismDate}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.baptismDate && (
          <p className="mt-1 text-xs text-red-600">
            {errors.baptismDate}
          </p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-slate-800">
          Your account will be registered
          as a Member.
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Your church role and account
          status are managed by the church
          system and cannot be changed
          during public registration.
        </p>
      </div>
    </section>
  );
}