"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Camera,
  User,
  X,
} from "lucide-react";

export default function PublicRegisterProfileImage({
  value,
  onChange,
  error,
}) {
  const [preview, setPreview] =
    useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(value);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl
      );
    };
  }, [value]);

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Profile Photo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a profile photo to help
          identify your account.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={52}
                strokeWidth={1.5}
                className="text-slate-400"
              />
            )}
          </div>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:bg-slate-100"
              aria-label="Remove profile photo"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <Camera size={17} />

          {preview
            ? "Change photo"
            : "Upload photo"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file =
                event.target.files?.[0] ||
                null;

              onChange(file);

              event.target.value = "";
            }}
          />
        </label>

        <p className="mt-2 text-xs text-slate-500">
          JPG, PNG or WEBP · Maximum 10MB
        </p>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}