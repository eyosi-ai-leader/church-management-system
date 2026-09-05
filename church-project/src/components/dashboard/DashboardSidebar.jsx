"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  UserRound,
  ClipboardList,
  Megaphone,
  Activity,
  ShieldCheck,
  Crown,
  Eye,
  BriefcaseBusiness,
} from "lucide-react";

import { getRoleName, ROLES } from "@/lib/roles";

const navigationByRole = {
  [ROLES.ADMIN]: [
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
          badge: "AI",
        },
        {
          name: "Insights",
          href: "/dashboard/insights",
          icon: BarChart3,
        },
      ],
    },
  ],

  [ROLES.PASTOR]: [
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
      label: "Church Management",
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
          badge: "AI",
        },
        {
          name: "Insights",
          href: "/dashboard/insights",
          icon: BarChart3,
        },
      ],
    },
  ],

  [ROLES.CHURCH_ELDER]: [
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
      label: "Church",
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
      label: "Oversight",
      items: [
        {
          name: "Insights",
          href: "/dashboard/insights",
          icon: BarChart3,
        },
      ],
    },
  ],

  [ROLES.MINISTRY_LEADER]: [
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
      label: "My Ministry",
      items: [
        {
          name: "Ministry Overview",
          href: "/dashboard/ministries",
          icon: Church,
        },
        {
          name: "Ministry Members",
          href: "/dashboard/members",
          icon: Users,
        },
        {
          name: "Ministry Events",
          href: "/dashboard/events",
          icon: CalendarDays,
        },
      ],
    },
    {
      label: "Activities",
      items: [
        {
          name: "Activities",
          href: "/dashboard/activities",
          icon: Activity,
          comingSoon: true,
        },
        {
          name: "Announcements",
          href: "/dashboard/announcements",
          icon: Megaphone,
          comingSoon: true,
        },
      ],
    },
  ],

  [ROLES.MEMBER]: [
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
      label: "My Church",
      items: [
        {
          name: "My Profile",
          href: "/dashboard/profile",
          icon: UserRound,
          comingSoon: true,
        },
        {
          name: "My Ministry",
          href: "/dashboard/my-ministry",
          icon: Church,
          comingSoon: true,
        },
        {
          name: "My Events",
          href: "/dashboard/my-events",
          icon: CalendarDays,
          comingSoon: true,
        },
        {
          name: "My Attendance",
          href: "/dashboard/attendance",
          icon: ClipboardList,
          comingSoon: true,
        },
      ],
    },
    {
      label: "Communication",
      items: [
        {
          name: "Announcements",
          href: "/dashboard/announcements",
          icon: Megaphone,
          comingSoon: true,
        },
      ],
    },
  ],
};

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

const roleConfig = {
  [ROLES.ADMIN]: {
    title: "ADMIN DASHBOARD",
    subtitle: "System Administration",
    icon: Crown,
  },
  [ROLES.PASTOR]: {
    title: "PASTOR DASHBOARD",
    subtitle: "Church Leadership",
    icon: ShieldCheck,
  },
  [ROLES.CHURCH_ELDER]: {
    title: "CHURCH ELDER",
    subtitle: "Church Oversight",
    icon: Eye,
  },
  [ROLES.MINISTRY_LEADER]: {
    title: "MINISTRY LEADER",
    subtitle: "Ministry Management",
    icon: BriefcaseBusiness,
  },
  [ROLES.MEMBER]: {
    title: "MEMBER DASHBOARD",
    subtitle: "My Church",
    icon: UserRound,
  },
};

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to load sidebar user:", error);
    }
  }, []);

  const roleId = Number(user?.roleId);

  const roleName = getRoleName(roleId);

  const navigation =
    navigationByRole[roleId] || navigationByRole[ROLES.MEMBER];

  const currentRole =
    roleConfig[roleId] || roleConfig[ROLES.MEMBER];

  const RoleIcon = currentRole.icon;

  const getInitials = () => {
    const firstName = user?.firstName?.trim() || "";
    const lastName = user?.lastName?.trim() || "";

    if (!firstName && !lastName) {
      return "?";
    }

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    return firstName.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    const firstName = user?.firstName?.trim() || "";
    const lastName = user?.lastName?.trim() || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "User";
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const toggleSection = (label) => {
    setOpenSections((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  const isSectionOpen = (section) => {
    if (openSections[section.label] !== undefined) {
      return openSections[section.label];
    }

    return section.items.some((item) => isActive(item.href));
  };

  const handleLogout = () => {
    document.cookie =
      "token=; path=/; max-age=0; SameSite=Lax";

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Church
              size={19}
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
              CHMS
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
              Church Management
            </p>
          </div>
        </Link>
      </div>

      {/* Role Identity */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <RoleIcon
                size={18}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold tracking-[0.08em] text-slate-900">
                {currentRole.title}
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                {currentRole.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[11px] font-medium text-slate-500">
              {roleName}
            </span>

            <span className="ml-auto text-[10px] font-medium text-slate-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-4">
          {navigation.map((section) => {
            const sectionOpen = isSectionOpen(section);

            return (
              <div key={section.label}>
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(section.label)
                  }
                  className="group mb-1.5 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400 group-hover:text-slate-600">
                    {section.label}
                  </span>

                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    className={`text-slate-400 transition-transform duration-200 ${
                      sectionOpen
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Section Items */}
                <div
                  className={`grid transition-all duration-200 ${
                    sectionOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        if (item.comingSoon) {
                          return (
                            <div
                              key={item.name}
                              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-300"
                            >
                              <Icon
                                size={18}
                                strokeWidth={1.8}
                                className="shrink-0 text-slate-300"
                              />

                              <span className="truncate">
                                {item.name}
                              </span>

                              <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                Soon
                              </span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-all duration-150 ${
                              active
                                ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            <Icon
                              size={19}
                              strokeWidth={
                                active ? 2.2 : 1.8
                              }
                              className={`shrink-0 transition-colors ${
                                active
                                  ? "text-white"
                                  : "text-slate-400 group-hover:text-slate-700"
                              }`}
                            />

                            <span className="truncate">
                              {item.name}
                            </span>

                            {item.badge && (
                              <span
                                className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                  active
                                    ? "bg-white/15 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 px-4 py-3">
        <div className="space-y-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-all ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.1 : 1.8}
                  className={
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <div className="group relative">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
              {getInitials()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {getDisplayName()}
              </p>

              <p className="truncate text-xs font-medium text-slate-400">
                {roleName}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="shrink-0 text-slate-400 transition-transform group-hover:rotate-180"
            />
          </button>

          {/* User Menu */}
          <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-full translate-y-2 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Settings size={16} />
              Settings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}