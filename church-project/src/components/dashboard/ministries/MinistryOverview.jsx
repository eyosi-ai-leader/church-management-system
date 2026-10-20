"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Building2 } from "lucide-react";
import {
  getMinistries,
  createMinistry,
  updateMinistry,
  updateMinistryStatus,
} from "@/lib/ministryApi";
import MinistryStats from "./MinistryStats";
import MinistryToolbar from "./MinistryToolbar";
import MinistryTable from "./MinistryTable";
import MinistryFormModal from "./MinistryFormModal";

export default function MinistryOverview() {
  const [ministries, setMinistries] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMinistries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMinistries({ search, status });
      const items = Array.isArray(response?.data) ? response.data : [];
      setMinistries(items);
    } catch (err) {
      setError(err.message || "Unable to load ministries.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadMinistries();
  }, [loadMinistries]);

  function openCreateModal() {
    setSelectedMinistry(null);
    setModalOpen(true);
    setNotice("");
  }

  function openEditModal(ministry) {
    setSelectedMinistry(ministry);
    setModalOpen(true);
    setNotice("");
  }

  async function handleSave(data) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (selectedMinistry) {
        await updateMinistry(selectedMinistry.id, data);
        setNotice("Ministry updated successfully.");
      } else {
        await createMinistry(data);
        setNotice("Ministry created successfully.");
      }

      setModalOpen(false);
      setSelectedMinistry(null);
      await loadMinistries();
    } catch (err) {
      setError(err.message || "Unable to save the ministry.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(ministry) {
    const nextStatus = ministry.status === "Active" ? "Inactive" : "Active";
    const confirmed = window.confirm(
      `${nextStatus === "Inactive" ? "Deactivate" : "Activate"} "${ministry.name}"?`
    );

    if (!confirmed) return;

    setUpdatingId(ministry.id);
    setError("");
    setNotice("");

    try {
      await updateMinistryStatus(ministry.id, nextStatus);
      setNotice(`Ministry ${nextStatus.toLowerCase()} successfully.`);
      await loadMinistries();
    } catch (err) {
      setError(err.message || "Unable to update ministry status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Building2 size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Ministries
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage church ministries, membership, and leadership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={() => setError("")}
            className="font-semibold hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {notice && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} className="font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <MinistryStats ministries={ministries} />

      <MinistryToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onCreate={openCreateModal}
        onRefresh={loadMinistries}
        loading={loading}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
          Loading ministries...
        </div>
      ) : error && ministries.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            Check that the backend is running and your session is authenticated.
          </p>
          <button
            type="button"
            onClick={loadMinistries}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      ) : (
        <MinistryTable
          ministries={ministries}
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          updatingId={updatingId}
        />
      )}

      <MinistryFormModal
        open={modalOpen}
        ministry={selectedMinistry}
        saving={saving}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setSelectedMinistry(null);
          }
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
