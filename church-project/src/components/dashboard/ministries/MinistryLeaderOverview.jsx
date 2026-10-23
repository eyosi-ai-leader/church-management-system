"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  RefreshCw,
  Users,
} from "lucide-react";
import { getMyMinistries } from "@/lib/ministryApi";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

function getMemberName(member) {
  const firstName =
    member.firstName ??
    member.first_name ??
    member.user?.firstName ??
    member.user?.first_name ??
    "";

  const middleName =
    member.middleName ??
    member.middle_name ??
    member.user?.middleName ??
    member.user?.middle_name ??
    "";

  const lastName =
    member.lastName ??
    member.last_name ??
    member.user?.lastName ??
    member.user?.last_name ??
    "";

  const fullName =
    member.fullName ??
    member.full_name ??
    member.name ??
    member.user?.fullName ??
    member.user?.full_name ??
    "";

  return (
    String(fullName).trim() ||
    [firstName, middleName, lastName]
      .map((name) => String(name).trim())
      .filter(Boolean)
      .join(" ") ||
    "Unnamed member"
  );
}

function getProfileImage(member) {
  const image =
    member.profileImage ??
    member.profile_image ??
    member.profilePhoto ??
    member.profile_photo ??
    member.photo ??
    member.image ??
    member.user?.profileImage ??
    member.user?.profile_image ??
    null;

  if (!image || typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const path = value.replace(/\\/g, "/").replace(/^\/+/, "");

  if (path.startsWith("api/")) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}/${path}`;
}

function MemberAvatar({ member, name }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getProfileImage(member);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const initials =
    name !== "Unnamed member"
      ? name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase()
      : "?";

  if (!imageUrl || imageFailed) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
        aria-label={name}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
      onError={() => setImageFailed(true)}
    />
  );
}

export default function MinistryLeaderOverview() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMinistries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyMinistries();

      // Support common API response formats:
      // { data: [...] }, { ministries: [...] }, or a direct array.
      const result = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.ministries)
            ? response.data.ministries
            : Array.isArray(response?.ministries)
              ? response.ministries
              : [];

      setMinistries(result);
    } catch (err) {
      setError(err?.message || "Unable to load ministry data.");
      setMinistries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMinistries();
  }, [loadMinistries]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Building2 size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Ministry
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Your assigned ministry and its members.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadMinistries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Unable to load your ministry</p>
            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={loadMinistries}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading your ministry...
        </div>
      ) : !error && ministries.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <Building2
            className="mx-auto text-slate-400"
            size={30}
          />

          <h2 className="mt-3 font-semibold text-slate-900">
            No ministry assigned
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ask an administrator to check your Ministry Leader assignment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ministries.map((ministry, index) => {
            const members = Array.isArray(ministry.members)
              ? ministry.members
              : [];

            const ministryId =
              ministry.id ??
              ministry.ministryId ??
              ministry.ministry_id ??
              index;

            const ministryName =
              ministry.name ??
              ministry.ministryName ??
              ministry.ministry_name ??
              "Unnamed ministry";

            const memberCount =
              ministry.memberCount ??
              ministry.member_count ??
              members.filter(
                (member) =>
                  String(
                    member.assignmentRole ??
                      member.assignment_role ??
                      "Member"
                  ).toLowerCase() === "member"
              ).length;

            return (
              <section
                key={ministryId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {ministryName}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {ministry.description ??
                          ministry.ministryDescription ??
                          ministry.ministry_description ??
                          "No description provided."}
                      </p>
                    </div>

                    {(ministry.status || ministry.ministry_status) && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {ministry.status ?? ministry.ministry_status}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 inline-flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                    <Users className="text-slate-500" size={20} />

                    <div>
                      <p className="text-xs text-slate-500">
                        Assigned members
                      </p>

                      <p className="text-lg font-bold text-slate-900">
                        {memberCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      Ministry Members
                    </h3>

                    <span className="text-sm text-slate-500">
                      {members.length} listed
                    </span>
                  </div>

                  {members.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                      No members were returned for this ministry.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-3 py-3">Member</th>
                            <th className="px-3 py-3">Member number</th>
                            <th className="px-3 py-3">Age</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Phone</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {members.map((member, memberIndex) => {
                            const memberId =
                              member.id ??
                              member.memberId ??
                              member.member_id ??
                              member.userId ??
                              member.user_id ??
                              `${ministryId}-${memberIndex}`;

                            const fullName = getMemberName(member);

                            const memberNumber =
                              member.memberNumber ??
                              member.member_number ??
                              "—";

                            const age = member.age ?? "—";

                            const email =
                              member.email ??
                              member.user?.email ??
                              "—";

                            const phone =
                              member.phone ??
                              member.userPhone ??
                              member.user_phone ??
                              member.user?.phone ??
                              member.user?.user_phone ??
                              "—";

                            const status =
                              member.memberStatus ??
                              member.member_status ??
                              member.status ??
                              "Member";

                            return (
                              <tr
                                key={memberId}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="px-3 py-4">
                                  <div className="flex items-center gap-3">
                                    <MemberAvatar
                                      member={member}
                                      name={fullName}
                                    />

                                    <div>
                                      <p className="font-semibold text-slate-900">
                                        {fullName}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-500">
                                        {status}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-3 py-4 text-slate-600">
                                  {memberNumber}
                                </td>

                                <td className="px-3 py-4 text-slate-600">
                                  {age}
                                </td>

                                <td className="px-3 py-4 text-slate-600">
                                  {email}
                                </td>

                                <td className="px-3 py-4 text-slate-600">
                                  {phone}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
