"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NavItem from "./navitem";
import Button from "@/components/shared/Button";
import navigation from "@/data/navigation";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-surface-muted"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 z-50 flex h-full w-[78%] max-w-xs flex-col bg-surface px-6 py-6 shadow-soft"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="mb-8 flex h-9 w-9 items-center justify-center self-end rounded-full text-ink transition hover:bg-surface-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>

              <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                {navigation.map((item) => (
                  <NavItem
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>

              <Button
                href="/give"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className="mt-auto w-full rounded-full border-ink py-3 text-center text-ink hover:bg-ink hover:text-white"
              >
                Give
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;