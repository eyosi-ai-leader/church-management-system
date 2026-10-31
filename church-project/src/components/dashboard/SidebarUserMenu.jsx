"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronUp,
  HelpCircle,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import UserAvatar from "@/components/shared/Avatar/UserAvatar";

const MENU_ITEMS = [
  { name: "My Profile", href: "/dashboard/profile", icon: UserRound },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export default function SidebarUserMenu({ user, roleName, onLogout }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  const displayName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  // Close when the person goes to another page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isActive = (href) => pathname.startsWith(href);

  return (
    <div className="border-t border-slate-200 p-3">
      <div ref={wrapperRef} className="relative">
        {open && (
          <div
            role="menu"
            aria-label="Account menu"
            className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3.5">
              <UserAvatar user={user} className="h-11 w-11 text-sm" />

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {displayName}
                </p>

                {user?.email && (
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                )}

                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {roleName}
                </p>
              </div>
            </div>

            <div className="p-1.5">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={active ? "text-white" : "text-slate-400"}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <LogOut size={17} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        )}

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
            open ? "bg-slate-100" : "hover:bg-slate-100"
          }`}
        >
          <UserAvatar user={user} className="h-10 w-10 text-xs" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {displayName}
            </p>

            <p className="truncate text-xs font-medium text-slate-400">
              {roleName}
            </p>
          </div>

          <ChevronUp
            size={16}
            aria-hidden="true"
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}