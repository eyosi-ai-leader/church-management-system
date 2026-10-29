"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, Lock, Trash2 } from "lucide-react";
import UserAvatar from "@/components/shared/Avatar/UserAvatar";
import { updateMyProfile } from "@/lib/profileApi";
import { updateStoredUser } from "@/lib/userStorage";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const toForm = (profile) => ({
  firstName: profile.firstName || "",
  middleName: profile.middleName || "",
  lastName: profile.lastName || "",
  gender: profile.gender || "",
  dateOfBirth: profile.dateOfBirth || "",
  phone: profile.phone || "",
  address: profile.address || "",
});

function Field({ id, label, required, children }) {
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
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "Not set"}
      </p>
    </div>
  );
}

export default function ProfileForm({ profile, onSaved }) {
  const [form, setForm] = useState(toForm(profile));
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const fileRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setForm(toForm(profile));
  }, [profile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const dirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(toForm(profile)) ||
      Boolean(photo) ||
      removePhoto,
    [form, profile, photo, removePhoto]
  );

  const avatarUser = {
    firstName: form.firstName,
    lastName: form.lastName,
    profileImage: preview || (removePhoto ? null : profile.profileImage),
  };

  const hasPhoto = Boolean(preview || (!removePhoto && profile.profileImage));

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
    setError("");
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Profile image must not exceed 10 MB.");
      return;
    }

    setError("");
    setSaved(false);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  }

  function handleRemovePhoto() {
    setPhoto(null);
    setPreview(null);
    setRemovePhoto(Boolean(profile.profileImage));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || !dirty) return;

    setError("");
    setSaved(false);

    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
      setError("First and last name must be at least 2 characters.");
      return;
    }

    if (form.dateOfBirth && form.dateOfBirth > today) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value.trim());
    });

    if (photo) data.append("profileImage", photo);
    if (removePhoto) data.append("removeProfileImage", "true");

    setSaving(true);

    try {
      const updated = await updateMyProfile(data);

      updateStoredUser({
        firstName: updated.firstName,
        middleName: updated.middleName,
        lastName: updated.lastName,
        profileImage: updated.profileImage,
      });

      setPhoto(null);
      setPreview(null);
      setRemovePhoto(false);
      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message || "We couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  }

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {saved && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} />
          Your profile has been updated.
        </div>
      )}

      {/* Photo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <UserAvatar user={avatarUser} className="h-24 w-24 text-2xl" />

          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-slate-900">
              {`${form.firstName} ${form.lastName}`.trim() || "Your name"}
            </p>
            <p className="text-sm text-slate-500">
              {profile.roleName}
              {memberSince && ` · Joined ${memberSince}`}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhoto}
                className="sr-only"
                id="profile-photo"
              />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Camera size={16} aria-hidden="true" />
                {hasPhoto ? "Change photo" : "Upload photo"}
              </button>

              {hasPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              JPG, PNG or WEBP, up to 10 MB.
            </p>
          </div>
        </div>
      </section>

      {/* Personal */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Personal information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="firstName" label="First name" required>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              maxLength={100}
              autoComplete="given-name"
              className={inputClass}
            />
          </Field>

          <Field id="middleName" label="Middle name">
            <input
              id="middleName"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              maxLength={100}
              autoComplete="additional-name"
              className={inputClass}
            />
          </Field>

          <Field id="lastName" label="Last name" required>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              maxLength={100}
              autoComplete="family-name"
              className={inputClass}
            />
          </Field>

          <Field id="gender" label="Gender">
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>

          <Field id="dateOfBirth" label="Date of birth">
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              max={today}
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="phone" label="Phone number">
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              maxLength={30}
              autoComplete="tel"
              className={inputClass}
            />
          </Field>

          <div className="md:col-span-2">
            <Field id="address" label="Address">
              <textarea
                id="address"
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                maxLength={500}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Read-only */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-start gap-3">
          <Lock size={18} className="mt-0.5 text-slate-400" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Church record
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              These details are managed by the church office. Contact them if
              something needs to change.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ReadOnly label="Email" value={profile.email} />
          <ReadOnly label="Member number" value={profile.memberNumber} />
          <ReadOnly label="Role" value={profile.roleName} />
          <ReadOnly label="Status" value={profile.status} />
          <ReadOnly label="Baptism date" value={profile.baptismDate} />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !dirty}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}