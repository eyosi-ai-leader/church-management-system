"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  Lock,
  Trash2,
} from "lucide-react";

import EventCover from "@/components/shared/events/EventCover";
import {
  createEvent,
  getEventForEdit,
  getEventOptions,
  updateEvent,
} from "@/lib/eventsApi";
import { toDateTimeLocal, VISIBILITY_LABELS } from "@/lib/eventFormat";
import { getStoredUser } from "@/lib/userStorage";

const CREATOR_ROLES = [1, 2, 4];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fieldClass = (error) =>
  `w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
  }`;

function Field({ id, label, required, hint, error, children }) {
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

      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

const emptyForm = {
  title: "",
  category: "Worship",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  repeatType: "none",
  repeatUntil: "",
  visibility: "public",
  ministryId: "",
  featured: false,
};

export default function EventEditor({ eventId = null }) {
  const router = useRouter();
  const editing = Boolean(eventId);

  const [user, setUser] = useState(undefined);
  const [options, setOptions] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [existingImage, setExistingImage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const allowed = Boolean(user) && CREATOR_ROLES.includes(Number(user.roleId));

  // Load the choices (and the event itself when editing).
  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    async function load() {
      try {
        const [loadedOptions, event] = await Promise.all([
          getEventOptions(),
          editing ? getEventForEdit(eventId) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        setOptions(loadedOptions);

        if (event) {
          setForm({
            title: event.title,
            category: event.category,
            description: event.description,
            location: event.location,
            startAt: toDateTimeLocal(event.firstStartAt),
            endAt: toDateTimeLocal(event.firstEndAt),
            repeatType: event.repeatType,
            repeatUntil: event.repeatUntil || "",
            visibility: event.visibility,
            ministryId: event.ministryId ? String(event.ministryId) : "",
            featured: event.featured,
          });

          setExistingImage(event.imageUrl || "");
        } else if (loadedOptions.role === "leader") {
          setForm((current) => ({
            ...current,
            visibility: "ministry",
            ministryId:
              loadedOptions.ministries.length === 1
                ? String(loadedOptions.ministries[0].id)
                : "",
          }));
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [allowed, editing, eventId]);

  // Release a temporary photo preview when it changes or the page closes.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  }

  function handleImage(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setServerError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setServerError("The image must not exceed 10 MB.");
      return;
    }

    setServerError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    setImage(null);
    setPreview("");
    setRemoveImage(Boolean(existingImage));
  }

  function validate() {
    const next = {};

    if (form.title.trim().length < 3) {
      next.title = "Enter a title (at least 3 characters).";
    }

    if (form.description.trim().length < 10) {
      next.description = "Write a description (at least 10 characters).";
    }

    if (form.location.trim().length < 2) {
      next.location = "Enter where the event takes place.";
    }

    if (!form.startAt) {
      next.startAt = "Choose the start date and time.";
    }

    if (form.endAt && form.startAt && form.endAt <= form.startAt) {
      next.endAt = "The end must be after the start.";
    }

    if (
      form.repeatType === "weekly" &&
      form.repeatUntil &&
      form.startAt &&
      form.repeatUntil < form.startAt.slice(0, 10)
    ) {
      next.repeatUntil = "This can't be before the first date.";
    }

    const needsMinistry =
      options?.role === "leader" || form.visibility === "ministry";

    if (needsMinistry && !form.ministryId) {
      next.ministryId = "Choose a ministry.";
    }

    return next;
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

    const data = new FormData();

    data.append("title", form.title.trim());
    data.append("category", form.category);
    data.append("description", form.description.trim());
    data.append("location", form.location.trim());
    data.append("startAt", form.startAt);
    data.append("endAt", form.endAt || "");
    data.append("repeatType", form.repeatType);
    data.append(
      "repeatUntil",
      form.repeatType === "weekly" ? form.repeatUntil || "" : ""
    );
    data.append("visibility", form.visibility);
    data.append("ministryId", form.ministryId || "");
    data.append(
      "featured",
      String(options?.canFeature && form.visibility === "public" && form.featured)
    );

    if (image) data.append("image", image);
    if (removeImage) data.append("removeImage", "true");

    setSaving(true);
    setServerError("");

    try {
      if (editing) {
        await updateEvent(eventId, data);
      } else {
        await createEvent(data);
      }

      router.push(`/dashboard/events?saved=${editing ? "updated" : "created"}`);
    } catch (err) {
      setServerError(err.message || "We couldn't save the event.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSaving(false);
    }
  }

  if (user === undefined) return null;

  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />

        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          You don&apos;t have access to this page
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Events can be added by pastors, administrators and ministry leaders.
        </p>

        <Link
          href="/dashboard/events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to events
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
      >
        <p className="text-sm text-red-700">{loadError}</p>

        <Link
          href="/dashboard/events"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to events
        </Link>
      </div>
    );
  }

  if (!options) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-sm text-slate-500"
      >
        <Loader2 size={18} className="animate-spin" />
        Loading...
      </div>
    );
  }

  const isLeader = options.role === "leader";
  const singleMinistry = isLeader && options.ministries.length === 1;

  const visibilityChoices = (
    options.canPublic ? ["public", "members", "ministry"] : ["members", "ministry"]
  ).map((value) => ({
    value,
    label: VISIBILITY_LABELS[value],
    hint:
      value === "public"
        ? "Shown on the church website and to everyone signed in."
        : value === "members"
        ? "Shown to signed-in members only."
        : "Shown only to members of the chosen ministry.",
  }));

  const needsMinistry = isLeader || form.visibility === "ministry";
  const shownImage = preview || (removeImage ? "" : existingImage);

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <Link
            href="/dashboard/events"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to events
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {editing ? "Edit event" : "Add event"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {editing
              ? "Changes appear on the website and in dashboards within about a minute."
              : "The event goes live as soon as you save it."}
          </p>
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Photo */}
        <Card title="Event photo" description="Optional. JPG, PNG or WEBP up to 10 MB.">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-32 w-full overflow-hidden rounded-xl bg-slate-100 sm:w-56">
              <EventCover src={shownImage} alt="Event photo preview" />
            </div>

            <div className="flex flex-wrap gap-3">
              <label
                htmlFor="event-image"
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500"
              >
                <Camera size={16} aria-hidden="true" />
                {shownImage ? "Change photo" : "Choose photo"}
              </label>

              <input
                id="event-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
                className="sr-only"
              />

              {shownImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card title="Event details">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field id="title" label="Title" required error={errors.title}>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="For example: Sunday Worship Service"
                  aria-invalid={Boolean(errors.title)}
                  className={`${fieldClass(errors.title)} h-11`}
                />
              </Field>
            </div>

            <Field id="category" label="Category" required>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`${fieldClass(false)} h-11`}
              >
                {options.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="location"
              label="Location"
              required
              error={errors.location}
            >
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength={255}
                placeholder="Main sanctuary, or a full address"
                aria-invalid={Boolean(errors.location)}
                className={`${fieldClass(errors.location)} h-11`}
              />
            </Field>

            <div className="md:col-span-2">
              <Field
                id="description"
                label="Description"
                required
                error={errors.description}
                hint="Line breaks are kept."
              >
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={handleChange}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.description)}
                  className={`${fieldClass(errors.description)} py-3`}
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* When */}
        <Card
          title="When"
          description="Times are shown exactly as you enter them, in the church's local time."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="startAt"
              label={editing && form.repeatType === "weekly" ? "First date and time" : "Starts"}
              required
              error={errors.startAt}
            >
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                value={form.startAt}
                onChange={handleChange}
                aria-invalid={Boolean(errors.startAt)}
                className={`${fieldClass(errors.startAt)} h-11`}
              />
            </Field>

            <Field id="endAt" label="Ends (optional)" error={errors.endAt}>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
                value={form.endAt}
                onChange={handleChange}
                aria-invalid={Boolean(errors.endAt)}
                className={`${fieldClass(errors.endAt)} h-11`}
              />
            </Field>

            <Field id="repeatType" label="Repeats">
              <select
                id="repeatType"
                name="repeatType"
                value={form.repeatType}
                onChange={handleChange}
                className={`${fieldClass(false)} h-11`}
              >
                <option value="none">Does not repeat</option>
                <option value="weekly">Every week</option>
              </select>
            </Field>

            {form.repeatType === "weekly" && (
              <Field
                id="repeatUntil"
                label="Last repeat (optional)"
                error={errors.repeatUntil}
                hint="Leave empty to repeat until you stop it."
              >
                <input
                  id="repeatUntil"
                  name="repeatUntil"
                  type="date"
                  value={form.repeatUntil}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.repeatUntil)}
                  className={`${fieldClass(errors.repeatUntil)} h-11`}
                />
              </Field>
            )}
          </div>
        </Card>

        {/* Audience */}
        <Card
          title="Who can see it"
          description="Choose where this event appears."
        >
          <fieldset>
            <legend className="sr-only">Who can see this event</legend>

            <div className="grid gap-3 sm:grid-cols-3">
              {visibilityChoices.map((choice) => (
                <label
                  key={choice.value}
                  className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-indigo-500 ${
                    form.visibility === choice.value
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={choice.value}
                    checked={form.visibility === choice.value}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <span className="text-sm font-semibold">{choice.label}</span>

                  <span
                    className={`text-xs leading-5 ${
                      form.visibility === choice.value
                        ? "text-white/75"
                        : "text-slate-500"
                    }`}
                  >
                    {choice.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {!options.canPublic && (
            <p className="mt-3 text-xs text-slate-500">
              Only pastors and administrators can publish events on the public
              website.
            </p>
          )}

          {(needsMinistry || options.ministries.length > 0) && (
            <div className="mt-5 max-w-md">
              <Field
                id="ministryId"
                label={needsMinistry ? "Ministry" : "Hosting ministry (optional)"}
                required={needsMinistry}
                error={errors.ministryId}
              >
                <select
                  id="ministryId"
                  name="ministryId"
                  value={form.ministryId}
                  onChange={handleChange}
                  disabled={singleMinistry}
                  aria-invalid={Boolean(errors.ministryId)}
                  className={`${fieldClass(errors.ministryId)} h-11 disabled:bg-slate-50`}
                >
                  {!singleMinistry && <option value="">Select ministry</option>}

                  {options.ministries.map((ministry) => (
                    <option key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {options.canFeature && form.visibility === "public" && (
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    featured: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Feature on the homepage
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  The homepage highlights one upcoming event. Featured events
                  are chosen first. Otherwise the next public event is shown.
                </span>
              </span>
            </label>
          )}
        </Card>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/events"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
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
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={17} aria-hidden="true" />
                {editing ? "Save changes" : "Create event"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}