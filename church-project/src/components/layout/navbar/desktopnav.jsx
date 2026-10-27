"use client";

import { useEffect, useRef, useState } from "react";
import { User, LayoutDashboard, LogOut, ChevronDown, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import NavItem from "./navitem";
import Button from "@/components/shared/Button";
import navigation from "@/data/navigation";
import useAuthUser from "@/hooks/useAuthUser";

const DesktopNav = ({ onGive }) => {
  const router = useRouter();
  const { user, logout } = useAuthUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop Navigation">
      {navigation.map((item) => (
        <NavItem key={item.label} href={item.href} label={item.label} />
      ))}

      <button
        type="button"
        onClick={onGive}
        className="ml-3 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        Give
      </button>

      {!user ? (
        <Button
          href="/login"
          variant="secondary"
          className="ml-2 rounded-full border-ink px-6 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-white"
        >
          Login
        </Button>
      ) : (
        <div className="relative ml-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">
              <User size={16} />
            </span>
            <span>{user.firstName || user.first_name || "User"}</span>
            <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default DesktopNav;