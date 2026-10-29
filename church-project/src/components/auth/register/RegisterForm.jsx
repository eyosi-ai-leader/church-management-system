"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
   import {
     PASSWORD_RULES_MESSAGE,
     isStrongPassword,
   } from "@/lib/passwordPolicy";

import RegisterHeader from "./RegisterHeader";
import PublicRegisterProfileImage from "./PublicRegisterProfileImage";
import PublicRegisterPersonalInfo from "./PublicRegisterPersonalInfo";
import PublicRegisterContactInfo from "./PublicRegisterContactInfo";
import PublicRegisterChurchInfo from "./PublicRegisterChurchInfo";
import PublicRegisterAccountInfo from "./PublicRegisterAccountInfo";


import { registerUser } from "@/lib/authApi";

const initialFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
  baptismDate: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] =
    useState(initialFormData);

  const [profileImage, setProfileImage] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

          if (!isStrongPassword(formData.password)) {
         newErrors.password = PASSWORD_RULES_MESSAGE;
       }

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (
      profileImage &&
      profileImage.size >
        10 * 1024 * 1024
    ) {
      newErrors.profileImage =
        "Profile image must not exceed 10MB.";
    }

    if (
      profileImage &&
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(profileImage.type)
    ) {
      newErrors.profileImage =
        "Only JPG, PNG and WEBP images are allowed.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const data =
        new FormData();

      data.append(
        "firstName",
        formData.firstName.trim()
      );

      if (formData.middleName.trim()) {
        data.append(
          "middleName",
          formData.middleName.trim()
        );
      }

      data.append(
        "lastName",
        formData.lastName.trim()
      );

      if (formData.gender) {
        data.append(
          "gender",
          formData.gender
        );
      }

      if (formData.dateOfBirth) {
        data.append(
          "dateOfBirth",
          formData.dateOfBirth
        );
      }

      data.append(
        "email",
        formData.email.trim()
      );

      if (formData.phone.trim()) {
        data.append(
          "phone",
          formData.phone.trim()
        );
      }

      if (formData.address.trim()) {
        data.append(
          "address",
          formData.address.trim()
        );
      }

      if (formData.baptismDate) {
        data.append(
          "baptismDate",
          formData.baptismDate
        );
      }

      data.append(
        "password",
        formData.password
      );

      data.append(
        "confirmPassword",
        formData.confirmPassword
      );

      if (profileImage) {
        data.append(
          "profileImage",
          profileImage
        );
      }

         const result =
        await registerUser(data);

      const memberNumber =
        result?.data?.memberNumber ||
        result?.memberNumber;

      if (memberNumber) {
        sessionStorage.setItem(
          "registrationMemberNumber",
          memberNumber
        );
      }

      // Send the new member to enter the 6-digit code.
      // "sent=1" starts the 60-second resend timer, because the
      // code was only just emailed. If the code email failed,
      // leave it out so they can resend straight away.
      const codeEmailFailed = (result?.message || "")
        .toLowerCase()
        .includes("could not be sent");

      const verifyEmail = formData.email.trim().toLowerCase();

      router.push(
        `/verify-email?email=${encodeURIComponent(verifyEmail)}${
          codeEmailFailed ? "" : "&sent=1"
        }`
      );
    } catch (error) {
      setSubmitError(
        error.message ||
          "Unable to create your account."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <RegisterHeader />

        {submitError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <PublicRegisterProfileImage
            value={profileImage}
            onChange={setProfileImage}
            error={
              errors.profileImage
            }
          />

          <PublicRegisterPersonalInfo
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          <PublicRegisterContactInfo
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          <PublicRegisterChurchInfo
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          <PublicRegisterAccountInfo
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm leading-6 text-slate-600">
                I agree to the church terms
                and conditions and confirm
                that the information I have
                provided is accurate.
              </span>
            </label>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}