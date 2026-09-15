"use client";

export default function PublicRegisterPersonalInfo({
  formData,
  errors,
  onChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us a little about yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            First name
            <span className="text-red-500">
              {" "}
              *
            </span>
          </label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            placeholder="First name"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
              errors.firstName
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Middle name
          </label>

          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={onChange}
            placeholder="Middle name"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
              errors.middleName
                ? "border-red-300"
                : "border-slate-300"
            }`}
          />

          {errors.middleName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.middleName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Last name
            <span className="text-red-500">
              {" "}
              *
            </span>
          </label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            placeholder="Last name"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
              errors.lastName
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select gender
            </option>
            <option value="Male">
              Male
            </option>
            <option value="Female">
              Female
            </option>
          </select>

          {errors.gender && (
            <p className="mt-1 text-xs text-red-600">
              {errors.gender}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date of birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.dateOfBirth && (
            <p className="mt-1 text-xs text-red-600">
              {errors.dateOfBirth}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}