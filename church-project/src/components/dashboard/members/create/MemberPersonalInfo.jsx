"use client";

export default function MemberPersonalInfo({
  form,
  errors,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Basic information about the church member.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            First name{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Enter first name"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.firstName
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
          />

          {errors.firstName && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Middle Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Middle name
          </label>

          <input
            type="text"
            name="middleName"
            value={form.middleName}
            onChange={onChange}
            placeholder="Enter middle name"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.middleName
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
          />

          {errors.middleName && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.middleName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Last name{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Enter last name"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              errors.lastName
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
          />

          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
              errors.gender
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
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
            <p className="mt-1.5 text-xs text-red-500">
              {errors.gender}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date of birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={onChange}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </div>
  );
}