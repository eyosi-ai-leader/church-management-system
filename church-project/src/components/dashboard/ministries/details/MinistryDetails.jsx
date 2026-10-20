"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  assignMinistryMember,
  removeMinistryMember,
} from "@/lib/ministryApi";

import {
  getMemberName,
  getAssignmentMemberId,
} from "./ministryMemberUtils";

import AssignmentTable from "./AssignmentTable";
import AssignMinistryMemberModal from "./AssignMinistryMemberModal";

export default function MinistryDetails({
  ministry,
  members = [],
  leaders = [],
  onRefresh,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [assignmentRole, setAssignmentRole] = useState("Member");
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const assignedIds = useMemo(
    () =>
      new Set(
        [...members, ...leaders]
          .map(getAssignmentMemberId)
          .filter((id) => id != null)
          .map(String)
      ),
    [members, leaders]
  );

  function openAssignModal(role) {
    setAssignmentRole(role);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  async function handleAssign(memberId, role) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await assignMinistryMember(ministry.id, {
        memberId,
        assignmentRole: role,
      });

      setModalOpen(false);
      setNotice(
        role === "Ministry Leader"
          ? "Ministry leader assigned successfully."
          : "Member added to the ministry successfully."
      );

      await onRefresh?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(person, role) {
    const memberId = getAssignmentMemberId(person);
    const name = getMemberName(person);

    if (memberId == null) {
      setError(`Cannot remove ${name}: the church member ID is missing.`);
      return;
    }

    const confirmed = window.confirm(
      `Remove ${name} from ${ministry.name}? This ends the assignment but does not delete the church member.`
    );

    if (!confirmed) return;

    setRemovingId(String(memberId));
    setError("");
    setNotice("");

    try {
      await removeMinistryMember(ministry.id, memberId);

      setNotice(
        role === "Ministry Leader"
          ? "Leadership assignment removed successfully."
          : "Member assignment removed successfully."
      );

      await onRefresh?.();
    } catch (err) {
      setError(err.message || "Unable to remove the assignment.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard
          label="Assigned members"
          value={members.length}
          icon={<Users size={21} />}
          color="blue"
        />
        <SummaryCard
          label="Ministry leaders"
          value={leaders.length}
          icon={<ShieldCheck size={21} />}
          color="violet"
        />
      </div>

      <AssignmentSection
        title="Ministry leadership"
        description="Assign and manage the leaders of this ministry."
        buttonLabel="Add leader"
        icon={<ShieldCheck size={19} />}
        people={leaders}
        role="Ministry Leader"
        removingId={removingId}
        onRemove={handleRemove}
        onAdd={() => openAssignModal("Ministry Leader")}
        disabled={ministry.status !== "Active"}
      />

      <AssignmentSection
        title="Ministry members"
        description="Church members can belong to multiple ministries."
        buttonLabel="Add member"
        icon={<Users size={19} />}
        people={members}
        role="Member"
        removingId={removingId}
        onRemove={handleRemove}
        onAdd={() => openAssignModal("Member")}
        disabled={ministry.status !== "Active"}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-800"
        >
          <RefreshCw size={15} />
          Refresh assignments
        </button>
      </div>

      <AssignMinistryMemberModal
        open={modalOpen}
        initialRole={assignmentRole}
        assignedIds={assignedIds}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`rounded-xl p-3 ${colors[color]}`}>{icon}</span>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AssignmentSection({
  title,
  description,
  buttonLabel,
  icon,
  people,
  role,
  removingId,
  onRemove,
  onAdd,
  disabled,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            {icon}
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserPlus size={16} />
          {buttonLabel}
        </button>
      </div>

      <AssignmentTable
        people={people}
        role={role}
        removingId={removingId}
        onRemove={onRemove}
      />
    </section>
  );
}