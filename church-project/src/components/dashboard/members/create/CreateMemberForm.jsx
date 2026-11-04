"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Info,
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
  sendInvitation: true,
};

export default function CreateMemberForm() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentRoleId, setCurrentRoleId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  // Set after a member is created successfully.
  const [result, setResult] = useState(null);

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
      const storedUser = localStorage.getItem("user");

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

      setCurrentRoleId(roleId);
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

  // Release the temporary photo preview when it changes or the page closes.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
    setPreview(URL.createObjectURL(file));
    setServerError("");
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!form.roleId) {
      nextErrors.roleId = "Role is required.";
    }

    return nextErrors;
  }

  function resetForm() {
    setForm(initialForm);
    setProfileImage(null);
    setPreview("");
    setErrors({});
    setServerError("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      window.scrollTo({ top: 0, behavior: "smooth" });

      return;
    }

    // Invitations are only for active members.
    const invite =
      form.status === "Active" && Boolean(form.sendInvitation);

    try {
      setSaving(true);
      setServerError("");

      const formData = new FormData();

      formData.append("firstName", form.firstName.trim());

      if (form.middleName.trim()) {
        formData.append("middleName", form.middleName.trim());
      }

      formData.append("lastName", form.lastName.trim());
      formData.append("email", form.email.trim());

      if (form.phone.trim()) {
        formData.append("phone", form.phone.trim());
      }

      formData.append("gender", form.gender);

      if (form.dateOfBirth) {
        formData.append("dateOfBirth", form.dateOfBirth);
      }

      if (form.baptismDate) {
        formData.append("baptismDate", form.baptismDate);
      }

      if (form.address.trim()) {
        formData.append("address", form.address.trim());
      }

      formData.append("roleId", form.roleId);
      formData.append("status", form.status || "Active");
      formData.append("sendInvitation", String(invite));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await createMember(formData);
      const data = response?.data || {};

      setResult({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        memberId: data.memberId,
        memberNumber: data.memberNumber,
        invitationRequested: Boolean(data.invitationRequested),
        invitationSent: Boolean(data.invitationSent),
        inactive: form.status !== "Active",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Create member error:", error);

      setServerError(
        error.message || "Failed to create member."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
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
          <Loader2 size={18} className="animate-spin" />
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

  /* Result screen after a member is created. */
  if (result) {
    const sent = result.invitationSent;
    const failed = result.invitationRequested && !result.invitationSent;

    return (
      <div className="mx-auto max-w-2xl pb-10">
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Member created
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {result.name}
            {result.memberNumber && ` · ${result.memberNumber}`}
          </p>

          <div
            className={`mx-auto mt-6 max-w-md rounded-xl border px-4 py-3 text-left text-sm ${
              sent
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : failed
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <p className="flex items-start gap-2">
              {sent ? (
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              ) : failed ? (
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <Info
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              )}

              <span>
                {sent &&
                  `An invitation was emailed to ${result.email}. They can choose a password from the link, which works once and expires in 48 hours.`}

                {failed &&
                  "The member was created, but the invitation email could not be sent. Check the address, then resend it from Member Access."}

                {!sent &&
                  !failed &&
                  (result.inactive
                    ? "This member is inactive, so no invitation was sent."
                    : "No invitation was sent, so this person can't sign in yet. Send one any time from Member Access or the members list.")}
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Add another member
            </button>

            {result.memberId && (
              <Link
                href={`/dashboard/members/${result.memberId}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View member
              </Link>
            )}

            {(failed || (!sent && !result.inactive)) && (
              <Link
                href="/dashboard/account-access"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open Member Access
              </Link>
            )}

            <Link
              href="/dashboard/members"
              className="inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Back to members
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-10">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
              Add a new member and keep their church information organized.
              They choose their own password from an invitation email.
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
                  <Loader2 size={16} className="animate-spin" />
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
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
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
          errors={errors}
          onChange={handleChange}
          isAdmin={currentRoleId === 1}
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
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Check size={17} />
              )}

              {saving ? "Creating..." : "Create member"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}