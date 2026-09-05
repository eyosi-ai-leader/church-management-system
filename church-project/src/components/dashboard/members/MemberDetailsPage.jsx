"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Church,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { getMemberById } from "@/lib/memberApi";

function getRoleName(member) {
  switch (Number(member?.role_id)) {
    case 1:
      return "Admin";
    case 2:
      return "Pastor";
    case 3:
      return "Church Elder";
    case 4:
      return "Ministry Leader";
    case 5:
      return "Member";
    default:
      return (
        member?.role_name ||
        member?.roleName ||
        "Member"
      );
  }
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function formatDate(date) {
  if (!date) {
    return "Not provided";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not provided";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          title={value || ""}
          className="mt-1 break-words text-sm font-medium text-slate-700"
        >
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon size={17} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-100" />

            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const memberId = params?.id;

  const [member, setMember] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!memberId) {
      return;
    }

    let mounted = true;

    async function loadMember() {
      try {
        setLoading(true);
        setError("");

        const result = await getMemberById(memberId);

        if (!mounted) {
          return;
        }

        const memberData =
          result?.data ||
          result?.member ||
          result;

        setMember(memberData);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.message ||
            "Unable to load member information."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMember();

    return () => {
      mounted = false;
    };
  }, [memberId]);

  if (loading) {
    return (
      <main className="min-h-full bg-slate-50/50 p-4 sm:p-6 lg:p-8">
        <LoadingPage />
      </main>
    );
  }

  if (error || !member) {
    return (
      <main className="min-h-full bg-slate-50/50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/members"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to members
          </Link>

          <div className="mt-6 rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <UserRound size={20} />
            </div>

            <h1 className="mt-4 text-base font-bold text-slate-900">
              Member not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {error ||
                "We could not find the requested member."}
            </p>

            <Link
              href="/dashboard/members"
              className="mt-6 inline-flex h-10 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to members
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const firstName =
    member.first_name ??
    member.firstName ??
    "";

  const middleName =
    member.middle_name ??
    member.middleName ??
    "";

  const lastName =
    member.last_name ??
    member.lastName ??
    "";

  const fullName =
    [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ") || "Unnamed member";

  const initials = getInitials(
    firstName,
    lastName
  );

  const profileImage =
    member.profile_image ??
    member.profileImage ??
    null;

  const role = getRoleName(member);

  const status =
    member.status || "Inactive";

  const phone =
    member.phone ||
    member.user_phone ||
    "Not provided";

  return (
    <main className="min-h-full bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/dashboard/members"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to members
            </Link>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Member profile
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Member Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View complete information for this church member.
            </p>
          </div>

          <Link
            href={`/dashboard/members/${member.id}/edit`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Edit3 size={16} />
            Edit member
          </Link>
        </div>

        {/* Profile header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {/* Profile Image */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-bold text-white shadow-sm">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || (
                      <UserRound size={24} />
                    )
                  )}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <h2
                    title={fullName}
                    className="truncate text-xl font-bold text-slate-900"
                  >
                    {fullName}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="max-w-[220px] truncate font-mono text-xs font-semibold text-slate-400">
                      {member.member_number ||
                        member.memberNumber ||
                        "No member number"}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {status}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal information */}
          <SectionCard
            icon={UserRound}
            title="Personal Information"
            description="Basic personal information about the member."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={UserRound}
                label="First name"
                value={firstName}
              />

              <InfoItem
                icon={UserRound}
                label="Middle name"
                value={middleName}
              />

              <InfoItem
                icon={UserRound}
                label="Last name"
                value={lastName}
              />

              <InfoItem
                icon={UsersRound}
                label="Gender"
                value={member.gender}
              />

              <InfoItem
                icon={CalendarDays}
                label="Date of birth"
                value={formatDate(
                  member.date_of_birth
                )}
              />

              <InfoItem
                icon={Mail}
                label="Email"
                value={member.email}
              />

              <InfoItem
                icon={Phone}
                label="Phone"
                value={phone}
              />
            </div>

            <div className="mt-3">
              <InfoItem
                icon={MapPin}
                label="Address"
                value={member.address}
              />
            </div>
          </SectionCard>

          {/* Church information */}
          <SectionCard
            icon={Church}
            title="Church Information"
            description="Membership and church-related information."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={ShieldCheck}
                label="Role"
                value={role}
              />

              <InfoItem
                icon={UsersRound}
                label="Member number"
                value={
                  member.member_number ||
                  member.memberNumber
                }
              />

              <InfoItem
                icon={CalendarDays}
                label="Baptism date"
                value={formatDate(
                  member.baptism_date
                )}
              />

              <InfoItem
                icon={Clock3}
                label="Joined"
                value={formatDate(
                  member.created_at
                )}
              />
            </div>

            <div className="mt-3">
              <InfoItem
                icon={ShieldCheck}
                label="Membership status"
                value={status}
              />
            </div>
          </SectionCard>
        </div>

        {/* Account information */}
        <SectionCard
          icon={ShieldCheck}
          title="Account Information"
          description="System and account information associated with this member."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              icon={ShieldCheck}
              label="User ID"
              value={member.user_id}
            />

            <InfoItem
              icon={ShieldCheck}
              label="Role ID"
              value={member.role_id}
            />

            <InfoItem
              icon={Clock3}
              label="Created"
              value={formatDate(
                member.created_at
              )}
            />

            <InfoItem
              icon={Clock3}
              label="Last updated"
              value={formatDate(
                member.updated_at
              )}
            />
          </div>
        </SectionCard>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <Link
            href={`/dashboard/members/${member.id}/edit`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Edit3 size={16} />
            Edit member
          </Link>
        </div>
      </div>
    </main>
  );
}