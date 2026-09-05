"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  Save,
} from "lucide-react";

import {
  getMemberById,
  updateMember,
} from "@/lib/memberApi";

import { canManageMembers } from "@/lib/roles";

import PersonalInformationForm from "./PersonalInformationForm";
import ChurchInformationForm from "./ChurchInformationForm";
import AccountInformationForm from "./AccountInformationForm";

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  memberNumber: "",
  roleId: "",
  baptismDate: "",
  status: "Active",
};

function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function getMemberData(result) {
  return result?.data || result;
}

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();

  const memberId = params?.id;

  /*
   * Authorization state
   *
   * Admin  = 1
   * Pastor = 2
   *
   * Only Admin and Pastor can edit members.
   */
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] =
    useState(true);

  const [member, setMember] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [profileImage, setProfileImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Check whether the current user can manage members.
   *
   * This protects the edit page itself, not just
   * the Edit button.
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
        "Failed to verify member edit access:",
        error
      );

      router.replace("/dashboard/members");
    } finally {
      setCheckingAccess(false);
    }
  }, [router]);

  /*
   * Load member information.
   *
   * This existing functionality remains unchanged.
   */
  useEffect(() => {
    if (!memberId) {
      return;
    }

    const loadMember = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getMemberById(memberId);

        const data =
          getMemberData(result);

        setMember(data);

        setForm({
          firstName:
            data.first_name || "",

          middleName:
            data.middle_name ||
            data.middleName ||
            "",

          lastName:
            data.last_name || "",

          email:
            data.email || "",

          phone:
            data.user_phone ||
            data.phone ||
            "",

          gender:
            data.gender || "",

          dateOfBirth:
            formatDateForInput(
              data.date_of_birth
            ),

          address:
            data.address || "",

          memberNumber:
            data.member_number || "",

          roleId:
            data.role_id !== undefined &&
            data.role_id !== null
              ? String(data.role_id)
              : "",

          baptismDate:
            formatDateForInput(
              data.baptism_date
            ),

          status:
            data.status || "Active",
        });

        const existingImage =
          data.profile_image ||
          data.profileImage ||
          "";

        setImagePreview(existingImage);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load member information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [memberId]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Profile image must be smaller than 10MB."
      );

      event.target.value = "";
      return;
    }

    setProfileImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setError("");
    setSuccess("");
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview("");
    setError("");
    setSuccess("");

    const input =
      document.getElementById(
        "profileImage"
      );

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "firstName",
        form.firstName.trim()
      );

      formData.append(
        "middleName",
        form.middleName.trim()
      );

      formData.append(
        "lastName",
        form.lastName.trim()
      );

      formData.append(
        "email",
        form.email.trim()
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "gender",
        form.gender || ""
      );

      formData.append(
        "dateOfBirth",
        form.dateOfBirth || ""
      );

      formData.append(
        "address",
        form.address.trim()
      );

      formData.append(
        "memberNumber",
        form.memberNumber.trim()
      );

      formData.append(
        "roleId",
        String(form.roleId)
      );

      formData.append(
        "baptismDate",
        form.baptismDate || ""
      );

      formData.append(
        "status",
        form.status
      );

      if (profileImage) {
        formData.append(
          "profileImage",
          profileImage
        );
      }

      formData.append(
        "removeProfileImage",
        imagePreview ? "false" : "true"
      );

      const result =
        await updateMember(
          memberId,
          formData
        );

      const updatedMember =
        getMemberData(result);

      if (updatedMember) {
        setMember(updatedMember);

        const updatedImage =
          updatedMember.profile_image ||
          updatedMember.profileImage ||
          "";

        setImagePreview(updatedImage);
      }

      setProfileImage(null);

      setSuccess(
        "Member information updated successfully."
      );

      setTimeout(() => {
        router.push(
          `/dashboard/members/${memberId}`
        );
      }, 700);
    } catch (err) {
      setError(
        err.message ||
          "Failed to update member."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Show loading state while checking
   * the user's authorization.
   */
  if (checkingAccess) {
    return <LoadingState />;
  }

  /*
   * Unauthorized users are redirected.
   *
   * Returning null prevents the edit form
   * from briefly appearing during redirect.
   */
  if (!authorized) {
    return null;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error && !member) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-sm font-bold text-red-800">
          Unable to load member
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <Link
          href="/dashboard/members"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href={`/dashboard/members/${memberId}`}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            title="Back to member"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Edit Member
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update member information and account settings.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check size={16} />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <PersonalInformationForm
          form={form}
          onChange={handleChange}
          profileImage={profileImage}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        <ChurchInformationForm
          form={form}
          onChange={handleChange}
        />

        <AccountInformationForm
          member={member}
        />

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Link
            href={`/dashboard/members/${memberId}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />

        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />

          <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />

      <div className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white" />

      <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}