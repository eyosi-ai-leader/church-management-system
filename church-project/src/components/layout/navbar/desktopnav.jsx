"use client";

import { useEffect, useState } from "react";
import {
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import NavItem from "./navitem";
import Button from "@/components/shared/Button";
import navigation from "@/data/navigation";

const DesktopNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  function loadUser() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }

  useEffect(() => {
    loadUser();
  }, [pathname]);

  function handleLogout() {
    // Remove authentication cookie
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Remove stored user
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Immediately update navbar
    setUser(null);
    setOpen(false);

    // Return to public website
    router.push("/");
  }

  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      aria-label="Desktop Navigation"
    >
      {navigation.map((item) => (
        <NavItem
          key={item.label}
          href={item.href}
          label={item.label}
        />
      ))}

      {!user ? (
        <Button
          href="/login"
          variant="secondary"
          className="ml-3 rounded-full border-ink px-6 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-white"
        >
          Login
        </Button>
      ) : (
        <div className="relative ml-3">
          <button
            type="button"
            onClick={() =>
              setOpen((previous) => !previous)
            }
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">
              <User size={16} />
            </span>

            <span>
              {user.firstName ||
                user.first_name ||
                "User"}
            </span>

            <ChevronDown
              size={15}
              className={`transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                type="button"
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
                onClick={handleLogout}
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