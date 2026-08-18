// src/components/pages/contact/ContactForm.jsx

"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900">
          Thank You
        </h3>

        <p className="mt-3 text-slate-600">
          Your prayer request has been received. We will pray with you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-sm p-8 space-y-6"
    >
      <input
        type="text"
        placeholder="Your Name"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
        required
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
        required
      />

      <input
        type="text"
        placeholder="Phone (Optional)"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
      />

      <textarea
        placeholder="Your Prayer Request"
        rows="5"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
        required
      />

      <Button type="submit">
        Submit Prayer Request
      </Button>
    </form>
  );
}