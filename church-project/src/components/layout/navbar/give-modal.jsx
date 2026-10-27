"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Copy, Check, Phone, Landmark } from "lucide-react";
import giving from "@/data/giving";

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: user can still select the text */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function GiveModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="give-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-surface p-6 shadow-soft sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </span>

            <h2 id="give-title" className="mt-4 font-display text-2xl font-medium text-ink">
              {giving.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body">{giving.thanks}</p>

            <div className="mt-6 space-y-3">
              {giving.accounts.map((acc) => (
                <div
                  key={`${acc.bank}-${acc.accountNumber}`}
                  className="rounded-2xl border border-line p-4"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-body">
                    <Landmark className="h-4 w-4" aria-hidden="true" />
                    {acc.bank}
                  </div>
                  {acc.accountName && (
                    <p className="mt-2 text-sm text-body">{acc.accountName}</p>
                  )}
                  {acc.accountNumber && (
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-lg font-semibold tabular-nums tracking-wide text-ink">
                        {acc.accountNumber}
                      </p>
                      <CopyButton value={acc.accountNumber} label="Copy account number" />
                    </div>
                  )}
                </div>
              ))}

              {giving.phone?.number && (
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-line p-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-body">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {giving.phone.label}
                    </div>
                    <a
                      href={`tel:${giving.phone.number.replace(/\s/g, "")}`}
                      className="mt-1 block text-lg font-semibold tabular-nums text-ink hover:underline"
                    >
                      {giving.phone.number}
                    </a>
                  </div>
                  <CopyButton value={giving.phone.number} label="Copy phone number" />
                </div>
              )}
            </div>

            <figure className="mt-6 border-t border-line pt-5">
              <blockquote className="font-display text-base italic leading-relaxed text-ink">
                “{giving.verse.text}”
              </blockquote>
              <figcaption className="mt-2 text-sm font-medium text-primary">
                {giving.verse.reference}
              </figcaption>
            </figure>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}