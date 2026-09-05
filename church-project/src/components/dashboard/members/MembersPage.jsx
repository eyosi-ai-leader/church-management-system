"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Users,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import {
  getMembers,
  deleteMember,
  updateMember,
} from "@/lib/memberApi";

import MembersTable from "./MembersTable";
import MemberFilters from "./MemberFilters";
import MemberPagination from "./MemberPagination";
import MemberDeleteDialog from "./MemberDeleteDialog";
import ChangeStatusModal from "./ChangeStatusModal";
import ChangeRoleModal from "./ChangeRoleModal";

export default function MembersPage() {
  const [members, setMembers] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    roleId: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [statusTarget, setStatusTarget] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const [roleTarget, setRoleTarget] = useState(null);
  const [changingRole, setChangingRole] = useState(false);

  const loadMembers = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getMembers({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          status: filters.status,
          roleId: filters.roleId,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        setMembers(response?.data || []);

        setPagination((previous) => ({
          ...previous,
          ...(response?.pagination || {}),
        }));
      } catch (error) {
        console.error(
          "Members loading error:",
          error
        );

        setError(
          error.message ||
            "Failed to load members."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      pagination.page,
      pagination.limit,
      filters.search,
      filters.status,
      filters.roleId,
      filters.sortBy,
      filters.sortOrder,
    ]
  );

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  function handleSearch(value) {
    setFilters((previous) => ({
      ...previous,
      search: value,
    }));

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleStatusChange(value) {
    setFilters((previous) => ({
      ...previous,
      status: value,
    }));

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleRoleChange(value) {
    setFilters((previous) => ({
      ...previous,
      roleId: value,
    }));

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleSortChange(sortBy) {
    setFilters((previous) => ({
      ...previous,
      sortBy,
      sortOrder:
        previous.sortBy === sortBy &&
        previous.sortOrder === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function handleClearFilters() {
    setFilters({
      search: "",
      status: "",
      roleId: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handlePageChange(page) {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteMember(deleteTarget.id);

      setDeleteTarget(null);

      await loadMembers(true);
    } catch (error) {
      console.error(
        "Delete member error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete member."
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleChangeStatus(member) {
    setStatusTarget(member);
    setError("");
  }

async function handleStatusConfirm(member, status) {
  if (!member) {
    return;
  }

  try {
    setChangingStatus(true);
    setError("");

    await updateMember(member.id, {
      status,
    });

    setStatusTarget(null);

    await loadMembers(true);
  } catch (error) {
    console.error(
      "Change member status error:",
      error
    );

    setError(
      error.message ||
        "Failed to change member status."
    );
  } finally {
    setChangingStatus(false);
  }
}

  function handleChangeRole(member) {
    setRoleTarget(member);
    setError("");
  }

 async function handleRoleConfirm(member, roleId) {
  if (!member) {
    return;
  }

  try {
    setChangingRole(true);
    setError("");

    await updateMember(member.id, {
      roleId: Number(roleId),
    });

    setRoleTarget(null);

    await loadMembers(true);
  } catch (error) {
    console.error(
      "Change member role error:",
      error
    );

    setError(
      error.message ||
        "Failed to change member role."
    );
  } finally {
    setChangingRole(false);
  }
}

  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.roleId);

  return (
    <div className="min-h-full space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Users
                size={19}
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Management
              </p>

              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                Members
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage church members, monitor their status, and
            keep member information organized.
          </p>
        </div>

        <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() => window.location.reload()}
    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
  >
    <RefreshCw size={16} />

    <span className="hidden sm:inline">
      Refresh
    </span>
  </button>

  <Link
    href="/dashboard/members/create"
    className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
  >
    <Plus size={17} />

    <span>Add member</span>
  </Link>
</div>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Total members
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {pagination.total.toLocaleString()}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Users size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Showing
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {members.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <UserPlus size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Current page
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {pagination.totalPages
                  ? `${pagination.page} / ${pagination.totalPages}`
                  : "0"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <span className="text-sm font-bold">
                {pagination.page}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}

      <MemberFilters
        filters={filters}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onSortChange={handleSortChange}
        onClear={handleClearFilters}
        hasFilters={hasFilters}
      />

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">
                Member action failed
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadMembers(true)}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Table */}

      <MembersTable
        members={members}
        loading={loading}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={handleSortChange}
        onDelete={setDeleteTarget}
        onChangeStatus={handleChangeStatus}
        onChangeRole={handleChangeRole}
      />

      {/* Pagination */}

      {!loading &&
        !error &&
        pagination.total > 0 && (
          <MemberPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}

      {/* Delete dialog */}

      <MemberDeleteDialog
        member={deleteTarget}
        deleting={deleting}
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
      />

      {/* Change Status Modal */}

   <ChangeStatusModal
  member={statusTarget}
  open={Boolean(statusTarget)}
  saving={changingStatus}
  onClose={() => setStatusTarget(null)}
  onConfirm={handleStatusConfirm}
/>

      {/* Change Role Modal */}

      <ChangeRoleModal
  member={roleTarget}
  open={Boolean(roleTarget)}
  saving={changingRole}
  onClose={() => setRoleTarget(null)}
  onConfirm={handleRoleConfirm}
/>
    </div>
  );
}