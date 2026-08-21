"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Church,
  CalendarDays,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";

const mainNavigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        name: "Members",
        href: "/dashboard/members",
        icon: Users,
      },
      {
        name: "Ministries",
        href: "/dashboard/ministries",
        icon: Church,
      },
      {
        name: "Events",
        href: "/dashboard/events",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        name: "Church AI",
        href: "/dashboard/ai",
        icon: Sparkles,
      },
      {
        name: "Insights",
        href: "/dashboard/insights",
        icon: BarChart3,
      },
    ],
  },
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Church size={18} strokeWidth={2} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">
              CHMS
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Church Management
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6">
          {mainNavigation.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        }
                      />

                      <span>{item.name}</span>

                      {item.name === "Church AI" && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          AI
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 px-3 py-3">
        <div className="space-y-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            A
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              Admin
            </p>

            <p className="truncate text-xs text-slate-400">
              Administrator
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </aside>
  );
}