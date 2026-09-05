"use client";

import { useState } from "react";

import { ArrowLeft, Check, Loader2 } from "lucide-react";

import Link from "next/link";

import { createMember } from "@/lib/memberApi";

import MemberProfileImage from "./MemberProfileImage";
import MemberPersonalInfo from "./MemberPersonalInfo";
import MemberContactInfo from "./MemberContactInfo";
import MemberChurchInfo from "./MemberChurchInfo";
import MemberAccountInfo from "./MemberAccountInfo";

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  baptismDate: "",
  address: "",
  memberNumber: "",
  roleId: "5",
  status: "Active",
  password: "",
};

export default function CreateMemberForm() {
  const [form, setForm] =
    useState(initialForm);

  const [profileImage, setProfileImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  }

  function handleProfileImage(file) {
    setProfileImage(file);

    if (!file) {
      setPreview("");
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password =
        "Password is required.";
    } else if (
      form.password.length < 6
    ) {
      nextErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (!form.memberNumber.trim()) {
      nextErrors.memberNumber =
        "Member number is required.";
    }

    if (!form.gender) {
      nextErrors.gender =
        "Gender is required.";
    }

    if (!form.roleId) {
      nextErrors.roleId =
        "Role is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setServerError("");

      const payload = {
        firstName:
          form.firstName.trim(),

        middleName:
          form.middleName.trim() ||
          undefined,

        lastName:
          form.lastName.trim(),

        email:
          form.email.trim(),

        password:
          form.password,

        phone:
          form.phone.trim() ||
          undefined,

        gender:
          form.gender,

        dateOfBirth:
          form.dateOfBirth ||
          undefined,

        baptismDate:
          form.baptismDate ||
          undefined,

        address:
          form.address.trim() ||
          undefined,

        memberNumber:
          form.memberNumber.trim(),

        roleId:
          Number(form.roleId),

        status:
          form.status || "Active",
      };

      await createMember(payload);

      window.location.href =
        "/dashboard/members";
    } catch (error) {
      console.error(
        "Create member error:",
        error
      );

      setServerError(
        error.message ||
          "Failed to create member."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full pb-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/dashboard/members"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to members
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Member
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add a new member and keep
              their church information
              organized.
            </p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/dashboard/members"
              className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Create member
                </>
              )}
            </button>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Profile Image */}
        <MemberProfileImage
          preview={preview}
          onChange={handleProfileImage}
        />

        {/* Personal Information */}
        <MemberPersonalInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        {/* Contact Information */}
        <MemberContactInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        {/* Church Information */}
        <MemberChurchInfo
          form={form}
          onChange={handleChange}
        />

        {/* Account Information */}
        <MemberAccountInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        {/* Mobile Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
          <div className="flex gap-3">
            <Link
              href="/dashboard/members"
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Check size={17} />
              )}

              {saving
                ? "Creating..."
                : "Create member"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}