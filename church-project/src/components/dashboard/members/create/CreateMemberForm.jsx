"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createMember } from "@/lib/memberApi";
import { canManageMembers } from "@/lib/roles";

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
  roleId: "5",
  status: "Active",
  password: "",
};

export default function CreateMemberForm() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const [form, setForm] = useState(initialForm);

  const [profileImage, setProfileImage] =
    useState(null);

  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);

  const [serverError, setServerError] =
    useState("");

  /*
   * Verify that the current user is allowed
   * to create members.
   *
   * Admin  = 1
   * Pastor = 2
   *
   * Church Elder, Ministry Leader and Member
   * are redirected back to the members page.
   */
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        router.replace("/dashboard/members");
        return;
      }

      const user = JSON.parse(storedUser);

      const roleId = Number(user?.roleId);

      if (!canManageMembers(roleId)) {
        router.replace("/dashboard/members");
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error(
        "Failed to verify member creation access:",
        error
      );

      router.replace("/dashboard/members");
    } finally {
      setCheckingAccess(false);
    }
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

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
    if (!file) {
      setProfileImage(null);
      setPreview("");
      return;
    }

    setProfileImage(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);

    setServerError("");
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
        form.email.trim()
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

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setServerError("");

      const formData = new FormData();

      formData.append(
        "firstName",
        form.firstName.trim()
      );

      if (form.middleName.trim()) {
        formData.append(
          "middleName",
          form.middleName.trim()
        );
      }

      formData.append(
        "lastName",
        form.lastName.trim()
      );

      formData.append(
        "email",
        form.email.trim()
      );

      formData.append(
        "password",
        form.password
      );

      if (form.phone.trim()) {
        formData.append(
          "phone",
          form.phone.trim()
        );
      }

      formData.append(
        "gender",
        form.gender
      );

      if (form.dateOfBirth) {
        formData.append(
          "dateOfBirth",
          form.dateOfBirth
        );
      }

      if (form.baptismDate) {
        formData.append(
          "baptismDate",
          form.baptismDate
        );
      }

      if (form.address.trim()) {
        formData.append(
          "address",
          form.address.trim()
        );
      }

      formData.append(
        "roleId",
        form.roleId
      );

      formData.append(
        "status",
        form.status || "Active"
      );

      if (profileImage) {
        formData.append(
          "profileImage",
          profileImage
        );
      }

      await createMember(formData);

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

  /*
   * While checking the user's role,
   * don't render the form.
   */
  if (checkingAccess) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Checking access...
        </div>
      </div>
    );
  }

  /*
   * Unauthorized users are redirected.
   * This prevents the form from flashing
   * before the redirect happens.
   */
  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-full pb-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
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

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <MemberProfileImage
          preview={preview}
          onChange={handleProfileImage}
        />

        <MemberPersonalInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        <MemberContactInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        <MemberChurchInfo
          form={form}
          onChange={handleChange}
        />

        <MemberAccountInfo
          form={form}
          errors={errors}
          onChange={handleChange}
        />

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