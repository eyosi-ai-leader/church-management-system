"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Search,
  Bell,
  Command,
  Plus,
  ChevronDown,
  Users,
  Church,
  CalendarDays,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  UserRound,
  ClipboardList,
  Megaphone,
  Activity,
  LayoutDashboard,
} from "lucide-react";

import { getRoleName, ROLES } from "@/lib/roles";

const navigationByRole = {
  [ROLES.ADMIN]: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Ministries", href: "/dashboard/ministries", icon: Church },
    { name: "Events", href: "/dashboard/events", icon: CalendarDays },
    { name: "Church AI", href: "/dashboard/ai", icon: Sparkles },
    { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ],

  [ROLES.PASTOR]: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Ministries", href: "/dashboard/ministries", icon: Church },
    { name: "Events", href: "/dashboard/events", icon: CalendarDays },
    { name: "Church AI", href: "/dashboard/ai", icon: Sparkles },
    { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ],

  [ROLES.CHURCH_ELDER]: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Ministries", href: "/dashboard/ministries", icon: Church },
    { name: "Events", href: "/dashboard/events", icon: CalendarDays },
    { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ],

  [ROLES.MINISTRY_LEADER]: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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
    {
      name: "Activities",
      href: "/dashboard/activities",
      icon: Activity,
    },
    {
      name: "Announcements",
      href: "/dashboard/announcements",
      icon: Megaphone,
    },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ],

  [ROLES.MEMBER]: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/profile", icon: UserRound },
    {
      name: "My Ministry",
      href: "/dashboard/my-ministry",
      icon: Church,
    },
    {
      name: "My Events",
      href: "/dashboard/my-events",
      icon: CalendarDays,
    },
    {
      name: "My Attendance",
      href: "/dashboard/attendance",
      icon: ClipboardList,
    },
    {
      name: "Announcements",
      href: "/dashboard/announcements",
      icon: Megaphone,
    },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ],
};

const quickActionsByRole = {
  [ROLES.ADMIN]: [
    {
      name: "Add Member",
      href: "/dashboard/members/create",
      icon: Users,
    },
    {
      name: "Manage Ministries",
      href: "/dashboard/ministries",
      icon: Church,
    },
    {
      name: "Manage Events",
      href: "/dashboard/events",
      icon: CalendarDays,
    },
  ],

  [ROLES.PASTOR]: [
    {
      name: "Add Member",
      href: "/dashboard/members/create",
      icon: Users,
    },
    {
      name: "Manage Ministries",
      href: "/dashboard/ministries",
      icon: Church,
    },
    {
      name: "Manage Events",
      href: "/dashboard/events",
      icon: CalendarDays,
    },
  ],

  [ROLES.CHURCH_ELDER]: [
    {
      name: "View Members",
      href: "/dashboard/members",
      icon: Users,
    },
    {
      name: "View Ministries",
      href: "/dashboard/ministries",
      icon: Church,
    },
    {
      name: "View Insights",
      href: "/dashboard/insights",
      icon: BarChart3,
    },
  ],

  [ROLES.MINISTRY_LEADER]: [
    {
      name: "My Ministry",
      href: "/dashboard/ministries",
      icon: Church,
    },
    {
      name: "Ministry Events",
      href: "/dashboard/events",
      icon: CalendarDays,
    },
  ],

  [ROLES.MEMBER]: [
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
    {
      name: "My Events",
      href: "/dashboard/my-events",
      icon: CalendarDays,
    },
  ],
};

export default function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const headerRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load header user:", error);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const roleId = Number(user?.roleId);
  const roleName = getRoleName(roleId);

  const navigation =
    navigationByRole[roleId] ||
    navigationByRole[ROLES.MEMBER];

  const quickActions =
    quickActionsByRole[roleId] ||
    quickActionsByRole[ROLES.MEMBER];

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return navigation.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [search, navigation]);

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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setActiveMenu("search");
  };

  const handleSearchFocus = () => {
    if (search.trim()) {
      setActiveMenu("search");
    }
  };

  const handleSearchKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      searchResults.length > 0
    ) {
      window.location.href = searchResults[0].href;
      setSearch("");
      setActiveMenu(null);
    }
  };

  const handleQuickActionToggle = () => {
    setActiveMenu((current) =>
      current === "quickAction"
        ? null
        : "quickAction"
    );
  };

  const handleNotificationToggle = () => {
    setActiveMenu((current) =>
      current === "notifications"
        ? null
        : "notifications"
    );
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur"
    >
      {/* Search */}
      <div className="relative flex items-center">
        <div className="relative hidden w-80 md:block">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
            placeholder={`Search ${roleName.toLowerCase()} dashboard...`}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            <Command size={10} />
            K
          </div>
        </div>

        {activeMenu === "search" && search.trim() && (
          <div className="absolute left-0 top-12 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {searchResults.length > 0 ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Dashboard Navigation
                  </p>
                </div>

                {searchResults.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setSearch("");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Icon
                        size={17}
                        className="text-slate-400"
                      />

                      <span>{item.name}</span>

                      <span className="ml-auto text-[10px] text-slate-300">
                        Enter
                      </span>
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="px-3 py-5 text-center">
                <Search
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-medium text-slate-600">
                  No results found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try another dashboard section.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Role */}
        <div className="hidden items-center rounded-lg bg-slate-50 px-3 py-2 lg:flex">
          <span className="text-xs font-semibold text-slate-500">
            {roleName}
          </span>
        </div>

        {/* Quick Action */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={handleQuickActionToggle}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              activeMenu === "quickAction"
                ? "border-slate-300 bg-slate-100 text-slate-900"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Plus size={15} />

            <span>Quick Action</span>

            <ChevronDown
              size={13}
              className={`transition-transform ${
                activeMenu === "quickAction"
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {activeMenu === "quickAction" && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <div className="px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {roleName} Actions
                </p>
              </div>

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    onClick={() =>
                      setActiveMenu(null)
                    }
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Icon
                      size={16}
                      className="text-slate-400"
                    />

                    <span>{action.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationToggle}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition ${
              activeMenu === "notifications"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {activeMenu === "notifications" && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">
                  Notifications
                </p>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                  Coming Soon
                </span>
              </div>

              <div className="py-6 text-center">
                <Bell
                  size={22}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-medium text-slate-600">
                  No new notifications
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Notifications will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </header>
  );
}