"use client";

const fieldClass = (error) =>
  `h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
  }`;

function Field({ id, label, required, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default function MemberPersonalInfo({
  form,
  errors = {},
  onChange,
  genderRequired = true,
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
        <Field
          id="firstName"
          label="First name"
          required
          error={errors.firstName}
        >
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Enter first name"
            autoComplete="off"
            aria-invalid={Boolean(errors.firstName)}
            className={fieldClass(errors.firstName)}
          />
        </Field>

        <Field
          id="middleName"
          label="Middle name"
          error={errors.middleName}
        >
          <input
            id="middleName"
            type="text"
            name="middleName"
            value={form.middleName}
            onChange={onChange}
            placeholder="Enter middle name"
            autoComplete="off"
            aria-invalid={Boolean(errors.middleName)}
            className={fieldClass(errors.middleName)}
          />
        </Field>

        <Field
          id="lastName"
          label="Last name"
          required
          error={errors.lastName}
        >
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Enter last name"
            autoComplete="off"
            aria-invalid={Boolean(errors.lastName)}
            className={fieldClass(errors.lastName)}
          />
        </Field>

        <Field
          id="gender"
          label="Gender"
          required={genderRequired}
          error={errors.gender}
        >
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            aria-invalid={Boolean(errors.gender)}
            className={fieldClass(errors.gender)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>

        <Field id="dateOfBirth" label="Date of birth">
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={onChange}
            max={new Date().toISOString().slice(0, 10)}
            className={fieldClass(false)}
          />
        </Field>
      </div>
    </div>
  );
}