"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Heart, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import NavItem from "./navitem";
import navigation from "@/data/navigation";
import useAuthUser from "@/hooks/useAuthUser";

const MobileNav = ({ onGive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuthUser();

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

  const close = () => setIsOpen(false);

  const goTo = (path) => {
    close();
    router.push(path);
  };

  const giveButton = (
    <button
      type="button"
      onClick={() => {
        close();
        onGive();
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:opacity-90"
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
      Give
    </button>
  );

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
              onClick={close}
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
              style={{ height: "100dvh" }}
              className="fixed right-0 top-0 z-50 flex h-screen w-[82%] max-w-xs flex-col bg-surface shadow-soft"
            >
              {/* Header: always visible */}
              <div className="flex shrink-0 justify-end px-5 pb-2 pt-5">
                <button
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-surface-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links: this part scrolls on short screens */}
              <nav
                className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-5 py-2"
                aria-label="Mobile Navigation"
              >
                {navigation.map((item) => (
                  <NavItem key={item.label} href={item.href} label={item.label} onClick={close} />
                ))}
              </nav>

              {/* Actions: always pinned and visible */}
              <div className="shrink-0 border-t border-line px-5 pb-5 pt-4">
                {!user ? (
                  <div className="grid grid-cols-2 gap-3">
                    {giveButton}
                    <button
                      type="button"
                      onClick={() => goTo("/login")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
                    >
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      Login
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-center text-sm text-body">
                      Signed in as{" "}
                      <span className="font-semibold text-ink">
                        {user.firstName || user.first_name || "User"}
                      </span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {giveButton}
                      <button
                        type="button"
                        onClick={() => goTo("/dashboard")}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                        Dashboard
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        logout();
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;