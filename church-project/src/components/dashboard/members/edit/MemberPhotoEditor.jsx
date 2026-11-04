"use client";

export default function MemberPhotoEditor({
  form,
  profileImage,
  imagePreview,
  onImageChange,
  onRemoveImage,
}) {
  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-bold uppercase text-white shadow-sm">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt="Member profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initials || "?"}</span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">
            Profile photo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            JPG, PNG or WEBP. Maximum file size: 10MB.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <label
              htmlFor="profileImage"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus-within:ring-2 focus-within:ring-slate-400"
            >
              {profileImage || imagePreview ? "Change photo" : "Choose photo"}
            </label>

            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
              className="sr-only"
            />

            {imagePreview && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}