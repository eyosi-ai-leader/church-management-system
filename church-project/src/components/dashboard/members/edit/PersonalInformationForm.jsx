"use client";

import React from "react";

export default function PersonalInformationForm({
  form,
  onChange,
  profileImage,
  imagePreview,
  onImageChange,
  onRemoveImage,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-0.5 text-xs text-slate-400">
          Basic personal and contact information.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {/* Profile Image */}
        <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-bold text-white shadow-sm">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Member profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {form.firstName?.[0] || ""}
                  {form.lastName?.[0] || ""}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Profile Photo
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP. Maximum file size: 10MB.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <label
                  htmlFor="profileImage"
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  {profileImage
                    ? "Change Photo"
                    : "Choose Photo"}
                </label>

                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onImageChange}
                  className="hidden"
                />

                {imagePreview && (
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
          />

          <FormField
            label="Middle Name"
            name="middleName"
            value={form.middleName}
            onChange={onChange}
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />

          <FormField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />

          <SelectField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            options={[
              {
                value: "",
                label: "Select gender",
              },
              {
                value: "Male",
                label: "Male",
              },
              {
                value: "Female",
                label: "Female",
              },
            ]}
          />

          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={onChange}
          />

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Enter member address"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
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
        placeholder={`Enter ${label.toLowerCase()}`}
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
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
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