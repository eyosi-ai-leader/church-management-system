"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  ShieldCheck,
  UserRoundCheck,
  Trash2,
} from "lucide-react";

export default function MemberActionsMenu({
  member,
  onDelete,
  onChangeStatus,
  onChangeRole,
  canManage,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function handleAction(callback) {
    setOpen(false);

    if (callback) {
      callback(member);
    }
  }

  /*
   * This component is only rendered for Admin
   * and Pastor from MembersTable.
   *
   * Keep this guard as a second frontend
   * protection layer.
   */
  if (!canManage) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        title="More actions"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <Link
            href={`/dashboard/members/${member.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Eye size={15} />
            View Member
          </Link>

          <Link
            href={`/dashboard/members/${member.id}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Pencil size={15} />
            Edit Member
          </Link>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() =>
              handleAction(onChangeStatus)
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <UserRoundCheck size={15} />
            Change Status
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(onChangeRole)
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ShieldCheck size={15} />
            Change Role
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() =>
              handleAction(onDelete)
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete Member
          </button>
        </div>
      )}
    </div>
  );
}