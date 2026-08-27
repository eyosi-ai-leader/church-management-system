"use client";

const roles = [
  {
    id: 1,
    name: "Admin",
  },
  {
    id: 2,
    name: "Pastor",
  },
  {
    id: 3,
    name: "Church Elder",
  },
  {
    id: 4,
    name: "Ministry Leader",
  },
  {
    id: 5,
    name: "Member",
  },
];

export default function ChurchInformationForm({
  form,
  onChange,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold text-slate-900">
          Church Information
        </h2>

        <p className="mt-0.5 text-xs text-slate-400">
          Membership details and church role.
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <FormField
          label="Member Number"
          name="memberNumber"
          value={form.memberNumber}
          onChange={onChange}
          required
        />

        <SelectField
          label="Role"
          name="roleId"
          value={form.roleId}
          onChange={onChange}
          required
          options={[
            {
              value: "",
              label: "Select role",
            },
            ...roles.map((role) => ({
              value: String(role.id),
              label: role.name,
            })),
          ]}
        />

        <FormField
          label="Baptism Date"
          name="baptismDate"
          type="date"
          value={form.baptismDate}
          onChange={onChange}
        />

        <SelectField
          label="Membership Status"
          name="status"
          value={form.status}
          onChange={onChange}
          options={[
            {
              value: "Active",
              label: "Active",
            },
            {
              value: "Inactive",
              label: "Inactive",
            },
          ]}
        />
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}