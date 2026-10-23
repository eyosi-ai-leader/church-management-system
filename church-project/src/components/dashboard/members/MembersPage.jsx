"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Users,
  RefreshCw,
  UserPlus,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Download,
} from "lucide-react";
import Link from "next/link";

import {
  getMembers,
  getMyMinistryMembers,
  deleteMember,
  updateMember,
} from "@/lib/memberApi";

import { canManageMembers } from "@/lib/roles";

import MembersTable from "./MembersTable";
import MemberFilters from "./MemberFilters";
import MemberPagination from "./MemberPagination";
import MemberDeleteDialog from "./MemberDeleteDialog";
import ChangeStatusModal from "./ChangeStatusModal";
import ChangeRoleModal from "./ChangeRoleModal";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  roleId: "",
  sortBy: "created_at",
  sortOrder: "desc",
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);

  const [ministries, setMinistries] = useState([]);
  const [ministriesLoading, setMinistriesLoading] = useState(false);
  const [selectedMinistryId, setSelectedMinistryId] = useState("");

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [statusTarget, setStatusTarget] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const [roleTarget, setRoleTarget] = useState(null);
  const [changingRole, setChangingRole] = useState(false);

  const [roleId, setRoleId] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setRoleId(Number(user?.roleId));
      }
    } catch (error) {
      console.error("Failed to load current user:", error);
    } finally {
      setUserLoaded(true);
    }
  }, []);

  const canManage = canManageMembers(roleId);
  const isMinistryLeader = Number(roleId) === 4;

  /*
   * Load the authenticated leader's assignment rows to discover
   * their ministries and calculate each ministry's active member count.
   *
   * The API returns assignment rows, so the same person can appear
   * in more than one ministry. The cards count regular Member
   * assignments, not Ministry Leader assignments.
   */
  const loadMinistrySummary = useCallback(async () => {
    if (!isMinistryLeader) {
      setMinistries([]);
      return;
    }

    try {
      setMinistriesLoading(true);

      const firstResponse = await getMyMinistryMembers({
        page: 1,
        limit: 100,
        search: "",
        status: "Active",
        roleId: "",
        sortBy: "created_at",
        sortOrder: "desc",
      });

      const firstRows = Array.isArray(firstResponse?.data)
        ? firstResponse.data
        : [];

      const totalPages = Math.max(
        1,
        Number(firstResponse?.pagination?.totalPages || 1)
      );

      let allRows = [...firstRows];

      // Support more than 100 assignments without silently
      // undercounting ministry cards.
      for (let page = 2; page <= totalPages; page += 1) {
        const response = await getMyMinistryMembers({
          page,
          limit: 100,
          search: "",
          status: "Active",
          roleId: "",
          sortBy: "created_at",
          sortOrder: "desc",
        });

        const pageRows = Array.isArray(response?.data)
          ? response.data
          : [];

        allRows = allRows.concat(pageRows);
      }

      const ministryMap = new Map();

      for (const row of allRows) {
        if (row.ministry_id == null || !row.ministry_name) {
          continue;
        }

        const id = String(row.ministry_id);

        if (!ministryMap.has(id)) {
          ministryMap.set(id, {
            id,
            name: row.ministry_name,
            status: "Active",
            memberCount: 0,
            assignmentCount: 0,
          });
        }

        const ministry = ministryMap.get(id);
        ministry.assignmentCount += 1;

        if (row.assignment_role === "Member") {
          ministry.memberCount += 1;
        }
      }

      const ministryList = Array.from(ministryMap.values()).sort(
        (a, b) => a.name.localeCompare(b.name)
      );

      setMinistries(ministryList);

      // Clear a selected ministry if it no longer appears in
      // the authenticated user's authorized ministry results.
      setSelectedMinistryId((currentId) => {
        if (
          currentId &&
          !ministryList.some((ministry) => ministry.id === currentId)
        ) {
          return "";
        }

        return currentId;
      });
    } catch (error) {
      console.error("Failed to load ministry summary:", error);
      setError(
        error.message || "Failed to load your ministry summary."
      );
    } finally {
      setMinistriesLoading(false);
    }
  }, [isMinistryLeader]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }

    if (isMinistryLeader) {
      loadMinistrySummary();
    } else {
      setMinistries([]);
    }
  }, [userLoaded, isMinistryLeader, loadMinistrySummary]);

  /*
   * Load the current table.
   * Ministry leaders use the scoped /my-ministry endpoint.
   * Other roles keep using the existing general members endpoint.
   */
  const loadMembers = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const requestOptions = {
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          status: filters.status,
          roleId: filters.roleId,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        };

        let response;

        if (isMinistryLeader) {
          response = await getMyMinistryMembers({
            ...requestOptions,
            ministryId: selectedMinistryId,
          });
        } else {
          response = await getMembers(requestOptions);
        }

        const rows = Array.isArray(response?.data)
          ? response.data
          : [];

        setMembers(rows);

        setPagination((previous) => ({
          ...previous,
          ...(response?.pagination || {}),
        }));
      } catch (error) {
        console.error("Members loading error:", error);
        setError(error.message || "Failed to load members.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      isMinistryLeader,
      selectedMinistryId,
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
    if (!userLoaded) {
      return;
    }

    loadMembers();
  }, [userLoaded, loadMembers]);

  async function handleRefresh() {
    if (refreshing) {
      return;
    }

    await Promise.all([
      loadMembers(true),
      isMinistryLeader ? loadMinistrySummary() : Promise.resolve(),
    ]);
  }

  function resetToFirstPage() {
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleMinistryChange(value) {
    setSelectedMinistryId(value);
    resetToFirstPage();
  }

  function handleSearch(value) {
    setFilters((previous) => ({
      ...previous,
      search: value,
    }));

    resetToFirstPage();
  }

  function handleStatusChange(value) {
    setFilters((previous) => ({
      ...previous,
      status: value,
    }));

    resetToFirstPage();
  }

  function handleRoleChange(value) {
    setFilters((previous) => ({
      ...previous,
      roleId: value,
    }));

    resetToFirstPage();
  }

  function handleSortChange(sortBy) {
    setFilters((previous) => ({
      ...previous,
      sortBy,
      sortOrder:
        previous.sortBy === sortBy && previous.sortOrder === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function handleClearFilters() {
    setFilters({ ...DEFAULT_FILTERS });
    setSelectedMinistryId("");
    resetToFirstPage();
  }

  function handlePageChange(page) {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  }

  async function handleDelete() {
    if (!deleteTarget || !canManage) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteMember(deleteTarget.id);
      setDeleteTarget(null);

      await loadMembers(true);
    } catch (error) {
      console.error("Delete member error:", error);
      setError(error.message || "Failed to delete member.");
    } finally {
      setDeleting(false);
    }
  }

  function handleChangeStatus(member) {
    if (!canManage) {
      return;
    }

    setStatusTarget(member);
    setError("");
  }

  async function handleStatusConfirm(member, status) {
    if (!member || !canManage) {
      return;
    }

    try {
      setChangingStatus(true);
      setError("");

      await updateMember(member.id, { status });
      setStatusTarget(null);

      await loadMembers(true);
    } catch (error) {
      console.error("Change member status error:", error);
      setError(error.message || "Failed to change member status.");
    } finally {
      setChangingStatus(false);
    }
  }

  function handleChangeRole(member) {
    if (!canManage) {
      return;
    }

    setRoleTarget(member);
    setError("");
  }

  async function handleRoleConfirm(member, selectedRoleId) {
    if (!member || !canManage) {
      return;
    }

    try {
      setChangingRole(true);
      setError("");

      await updateMember(member.id, {
        roleId: Number(selectedRoleId),
      });

      setRoleTarget(null);

      await loadMembers(true);
    } catch (error) {
      console.error("Change member role error:", error);
      setError(error.message || "Failed to change member role.");
    } finally {
      setChangingRole(false);
    }
  }

  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.roleId) ||
    Boolean(selectedMinistryId);

  const selectedMinistry = ministries.find(
    (ministry) => ministry.id === selectedMinistryId
  );

  // Export the members currently loaded in the table as an Excel-compatible CSV.
  const handleExportExcel = () => {
    if (!members.length) {
      alert("There are no members to export.");
      return;
    }

    const columns = [
      ["Member Number", "member_number"],
      ["First Name", "first_name"],
      ["Middle Name", "middle_name"],
      ["Last Name", "last_name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Gender", "gender"],
      ["Date of Birth", "date_of_birth"],
      ["Address", "address"],
      ["Member Status", "status"],
      ["Ministry", "ministry_name"],
      ["Assignment Role", "assignment_role"],
    ];

    const escapeCsv = (value) => {
      const text = value == null ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvRows = [
      columns.map(([label]) => escapeCsv(label)).join(","),
      ...members.map((member) =>
        columns
          .map(([, key]) => escapeCsv(member[key]))
          .join(",")
      ),
    ];

    // BOM helps Excel display UTF-8 text correctly.
    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const ministryName =
      selectedMinistryId && members[0]?.ministry_name
        ? members[0].ministry_name
        : "All-My-Ministries";

    const safeFileName = ministryName
      .replace(/[^a-z0-9-_]/gi, "-")
      .replace(/-+/g, "-");

    link.href = url;
    link.download = `${safeFileName}-Members.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              {isMinistryLeader ? (
                <Building2 size={19} strokeWidth={2} />
              ) : (
                <Users size={19} strokeWidth={2} />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {isMinistryLeader ? "Ministry Management" : "Management"}
              </p>

              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                {isMinistryLeader ? "Ministry Members" : "Members"}
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {isMinistryLeader
              ? "Manage and organize your ministry teams. View assignments across your ministries or select one ministry to focus on."
              : canManage
                ? "Manage church members, monitor their status, and keep member information organized."
                : "View church member information and directory records."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export members to CSV */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!members.length}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>

          {canManage && (
            <Link
              href="/dashboard/members/create"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              <span>Add member</span>
            </Link>
          )}
        </div>
      </div>

      {/* Ministry cards — Ministry Leader only */}
      {isMinistryLeader && (
        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your ministries
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a card to view its assigned members.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-400">
              {ministries.length}{" "}
              {ministries.length === 1 ? "ministry" : "ministries"}
            </p>
          </div>

          {ministriesLoading && ministries.length === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : ministries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Building2 className="mx-auto text-slate-400" size={24} />

              <h3 className="mt-3 text-sm font-semibold text-slate-800">
                No active ministry assignments
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                Your ministries will appear here when you have an active
                Ministry Leader assignment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {ministries.map((ministry) => {
                const isSelected = selectedMinistryId === ministry.id;

                return (
                  <button
                    key={ministry.id}
                    type="button"
                    onClick={() =>
                      handleMinistryChange(
                        isSelected ? "" : ministry.id
                      )
                    }
                    aria-pressed={isSelected}
                    className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                      isSelected
                        ? "border-slate-900 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-200">
                        <Building2 size={19} />
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          title={ministry.name}
                          className="truncate text-sm font-bold text-slate-900"
                        >
                          {ministry.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Assigned members
                        </p>
                      </div>

                      <span className="text-3xl font-bold tracking-tight text-slate-900">
                        {ministry.memberCount}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-medium text-slate-500">
                        {isSelected ? "Currently selected" : "View members"}
                      </span>

                      {isSelected ? (
                        <CheckCircle2
                          size={16}
                          className="text-slate-900"
                        />
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className="text-slate-400 transition group-hover:text-slate-900"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Ministry selector */}
      {isMinistryLeader && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Building2 size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Select ministry
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selectedMinistry
                    ? `Showing assignments for ${selectedMinistry.name}.`
                    : "All my ministries — view assignments across your ministry teams."}
                </p>
              </div>
            </div>

            <div className="w-full sm:max-w-xs">
              <select
                value={selectedMinistryId}
                onChange={(event) =>
                  handleMinistryChange(event.target.value)
                }
                disabled={ministriesLoading && ministries.length === 0}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">All my ministries</option>

                {ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* General member overview cards for non-Ministry Leaders */}
      {!isMinistryLeader && (
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
      )}

      {/* Existing search and filters */}
      <MemberFilters
        filters={filters}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onSortChange={handleSortChange}
        onClear={handleClearFilters}
        hasFilters={hasFilters}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">
                Could not complete the request
              </p>

              <p className="mt-1 text-xs text-red-600">{error}</p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Assignment-aware table */}
      <MembersTable
        members={members}
        loading={loading}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={handleSortChange}
        onDelete={setDeleteTarget}
        onChangeStatus={handleChangeStatus}
        onChangeRole={handleChangeRole}
        canManage={canManage}
        isMinistryLeader={isMinistryLeader}
      />

      {!loading && !error && pagination.total > 0 && (
        <MemberPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Existing church-wide management actions remain Admin/Pastor only */}
      {canManage && (
        <MemberDeleteDialog
          member={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {canManage && (
        <ChangeStatusModal
          member={statusTarget}
          open={Boolean(statusTarget)}
          saving={changingStatus}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusConfirm}
        />
      )}

      {canManage && (
        <ChangeRoleModal
          member={roleTarget}
          open={Boolean(roleTarget)}
          saving={changingRole}
          onClose={() => setRoleTarget(null)}
          onConfirm={handleRoleConfirm}
        />
      )}
    </div>
  );
}