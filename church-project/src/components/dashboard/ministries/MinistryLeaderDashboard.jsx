
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  RefreshCw,
  Save,
  Users,
  UserRound,
  ShieldCheck,
  Pencil,
} from "lucide-react";

import {
  getMyMinistries,
  getLeaderMinistryMembers,
  updateLeaderMinistryDetails,
  updateLeaderMemberAssignmentStatus,
  removeLeaderMinistryMember,
} from "@/lib/ministryApi";

export default function MinistryLeaderDashboard() {
  const [ministries, setMinistries] = useState([]);
  const [ministryId, setMinistryId] = useState("");
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedMinistry =
    ministries.find((item) => String(item.id) === String(ministryId)) ||
    null;

  const loadMinistries = useCallback(async () => {
    setError("");

    try {
      const response = await getMyMinistries();
      const items = Array.isArray(response?.data) ? response.data : [];

      setMinistries(items);

      setMinistryId((current) => {
        if (items.some((item) => String(item.id) === String(current))) {
          return current;
        }

        return items.length ? String(items[0].id) : "";
      });
    } catch (err) {
      setError(err.message || "Unable to load your ministries.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMembers = useCallback(async () => {
    if (!ministryId) {
      setMembers([]);
      return;
    }

    try {
      const response = await getLeaderMinistryMembers(ministryId, filter);
      setMembers(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Unable to load ministry members.");
    }
  }, [ministryId, filter]);

  useEffect(() => {
    loadMinistries();
  }, [loadMinistries]);

  useEffect(() => {
    if (!selectedMinistry) return;

    setName(selectedMinistry.name || "");
    setDescription(selectedMinistry.description || "");
    setEditing(false);
  }, [ministryId, selectedMinistry?.name, selectedMinistry?.description]);

  useEffect(() => {
    if (!loading) loadMembers();
  }, [loading, loadMembers]);

  async function refreshAll() {
    setRefreshing(true);
    setError("");

    try {
      await loadMinistries();
      await loadMembers();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSaveDetails(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Ministry name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await updateLeaderMinistryDetails(ministryId, {
        name: name.trim(),
        description: description.trim(),
      });

      const updated = response?.data;

      setMinistries((current) =>
        current.map((item) =>
          String(item.id) === String(ministryId)
            ? { ...item, ...(updated || {}), name: name.trim(), description: description.trim() }
            : item
        )
      );

      setEditing(false);
      setNotice("Ministry details updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update ministry details.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(person) {
    const memberId = person.member_id;

    if (!memberId || person.assignment_role === "Ministry Leader") return;

    const nextStatus =
      person.assignment_status === "Active" ? "Inactive" : "Active";

    const confirmed = window.confirm(
      `${nextStatus === "Inactive" ? "Deactivate" : "Reactivate"} this member's assignment in ${selectedMinistry?.name}?`
    );

    if (!confirmed) return;

    setUpdatingId(String(memberId));
    setError("");
    setNotice("");

    try {
      await updateLeaderMemberAssignmentStatus(
        ministryId,
        memberId,
        nextStatus
      );

      setNotice(`Member assignment ${nextStatus.toLowerCase()} successfully.`);
      await loadMembers();
    } catch (err) {
      setError(err.message || "Unable to update the assignment.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(person) {
    if (!person.member_id || person.assignment_role === "Ministry Leader") {
      return;
    }

    const fullName = [
      person.first_name,
      person.middle_name,
      person.last_name,
    ].filter(Boolean).join(" ");

    if (!window.confirm(
      `Remove ${fullName || "this member"} from ${selectedMinistry?.name}? Their church account and other ministry assignments will remain unchanged.`
    )) {
      return;
    }

    setUpdatingId(String(person.member_id));
    setError("");
    setNotice("");

    try {
      await removeLeaderMinistryMember(ministryId, person.member_id);
      setNotice("Member removed from your ministry.");
      await loadMembers();
    } catch (err) {
      setError(err.message || "Unable to remove this member.");
    } finally {
      setUpdatingId(null);
    }
  }

  function exportCsv() {
    const headers = [
      "Full Name",
      "Member Number",
      "Email",
      "Phone",
      "Age",
      "Gender",
      "Member Status",
      "Assignment Status",
    ];

    const quote = (value) => {
      let text = String(value ?? "");
      if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = members.map((person) => [
      [person.first_name, person.middle_name, person.last_name]
        .filter(Boolean).join(" "),
      person.member_number,
      person.email,
      person.user_phone || person.member_phone,
      person.age,
      person.gender,
      person.member_status,
      person.assignment_status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(quote).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ministry-members.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading your ministries...</div>;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <Building2 size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Ministry
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your ministry details and member assignments.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      {ministries.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Building2 className="mx-auto text-slate-300" size={32} />
          <h2 className="mt-3 font-semibold text-slate-900">No assigned ministry</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your account is not currently assigned as a leader of an active ministry.
          </p>
        </section>
      ) : (
        <>
          {ministries.length > 1 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="leader-ministry" className="mb-2 block text-sm font-semibold text-slate-700">
                Select ministry
              </label>
              <select
                id="leader-ministry"
                value={ministryId}
                onChange={(event) => {
                  setMinistryId(event.target.value);
                  setError("");
                  setNotice("");
                }}
                className="w-full max-w-lg rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {ministries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </section>
          )}

          {selectedMinistry && (
            <>
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Ministry overview
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      {selectedMinistry.name}
                    </h2>
                    <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {selectedMinistry.description || "No description provided."}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {selectedMinistry.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditing((current) => !current)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    {editing ? "Cancel editing" : "Edit details"}
                  </button>
                </div>

                {editing && (
                  <form onSubmit={handleSaveDetails} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                    <div>
                      <label htmlFor="ministry-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Ministry name
                      </label>
                      <input
                        id="ministry-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="ministry-description" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        id="ministry-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? "Saving..." : "Save details"}
                    </button>
                  </form>
                )}
              </section>

              <section className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Displayed assignments" value={members.length} icon={<Users size={20} />} />
                <StatCard label="Ministry leaders" value={selectedMinistry.leaderCount ?? 1} icon={<ShieldCheck size={20} />} />
                <StatCard label="Ministry status" value={selectedMinistry.status || "—"} icon={<Building2 size={20} />} />
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">Ministry members</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      View member information and manage assignments in this ministry.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      aria-label="Filter assignments by status"
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="Active">Active assignments</option>
                      <option value="Inactive">Inactive assignments</option>
                      <option value="All">All assignments</option>
                    </select>
                    <button
                      type="button"
                      onClick={exportCsv}
                      disabled={!members.length}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Member", "Member number", "Age", "Gender", "Phone", "Assignment", "Member status", "Actions"].map((label) => (
                          <th key={label} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((person) => {
                        const fullName = [
                          person.first_name,
                          person.middle_name,
                          person.last_name,
                        ].filter(Boolean).join(" ");

                        const isLeader = person.assignment_role === "Ministry Leader";
                        const busy = updatingId === String(person.member_id);

                        return (
                          <tr key={person.assignment_id ?? `${person.ministry_id}-${person.member_id}`} className="hover:bg-slate-50/70">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {person.profile_image ? (
                                  <img src={person.profile_image} alt="" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <UserRound size={18} />
                                  </span>
                                )}
                                <div>
                                  <p className="font-semibold text-slate-800">{fullName || "Unnamed member"}</p>
                                  <p className="text-sm text-slate-500">{person.email || "No email"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">{person.member_number || "—"}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{person.age ?? "—"}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{person.gender || "—"}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{person.user_phone || person.member_phone || "—"}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{person.assignment_role || "Member"}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${person.assignment_status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                {person.assignment_status || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {isLeader ? (
                                <span className="text-xs text-slate-400">Leader account protected</span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleStatusChange(person)}
                                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                  >
                                    {busy ? "Updating..." : person.assignment_status === "Active" ? "Deactivate" : "Reactivate"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleRemove(person)}
                                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {members.length === 0 && (
                    <div className="p-10 text-center">
                      <Users className="mx-auto text-slate-300" size={28} />
                      <p className="mt-3 text-sm font-semibold text-slate-700">No assignments found</p>
                      <p className="mt-1 text-sm text-slate-500">Try another status filter or add a member when the eligible-member lookup is connected.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-blue-50 p-3 text-blue-700">{icon}</span>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
