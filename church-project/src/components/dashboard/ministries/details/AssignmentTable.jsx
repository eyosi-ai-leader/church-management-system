
"use client";

import {
  Download,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import {
  getMemberName,
  getMemberEmail,
  getMemberNumber,
  getAssignmentMemberId,
} from "./ministryMemberUtils";

function getPhone(person = {}) {
  return (
    person.user_phone ||
    person.phone ||
    person.mobile ||
    person.phone_number ||
    "—"
  );
}

function getProfileImage(person = {}) {
  return (
    person.profile_image ||
    person.profileImage ||
    person.image_url ||
    null
  );
}

function safeCsvValue(value) {
  let text = String(value ?? "");

  // Prevent untrusted text from being interpreted as a spreadsheet formula.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function exportCsv(people, role) {
  const headers = [
    "Full Name",
    "Member Number",
    "Phone",
    "Email",
    "Assignment Role",
    "Profile Image URL",
  ];

  const rows = people.map((person) => [
    getMemberName(person),
    getMemberNumber(person),
    getPhone(person),
    getMemberEmail(person),
    person.assignment_role || role,
    getProfileImage(person) || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(safeCsvValue).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `ministry-${role
    .toLowerCase()
    .replace(/\s+/g, "-")}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function printDirectory(people, role) {
  const rows = people
    .map(
      (person) => `
        <tr>
          <td>${escapeHtml(getMemberName(person))}</td>
          <td>${escapeHtml(getMemberNumber(person))}</td>
          <td>${escapeHtml(getPhone(person))}</td>
          <td>${escapeHtml(getMemberEmail(person))}</td>
          <td>${escapeHtml(person.assignment_role || role)}</td>
        </tr>
      `
    )
    .join("");

  const printWindow = window.open(
    "",
    "_blank",
    "width=1100,height=750"
  );

  if (!printWindow) {
    window.alert(
      "The print window was blocked. Allow pop-ups for this site and try again."
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ministry ${escapeHtml(role)} Directory</title>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #1e293b;
          }

          h1 {
            margin-bottom: 6px;
          }

          p {
            color: #64748b;
            margin-bottom: 20px;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 12px;
          }

          th,
          td {
            border: 1px solid #cbd5e1;
            padding: 9px;
            text-align: left;
            overflow-wrap: anywhere;
          }

          th {
            background: #f1f5f9;
          }

          @media print {
            body {
              padding: 0;
            }

            tr {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>Ministry ${escapeHtml(role)} Directory</h1>

        <p>
          Generated ${escapeHtml(new Date().toLocaleString())}
          · ${people.length} people
        </p>

        <table>
          <thead>
            <tr>
              <th>Full name</th>
              <th>Member number</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Assignment role</th>
            </tr>
          </thead>

          <tbody>${rows}</tbody>
        </table>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

export default function AssignmentTable({
  people = [],
  role,
  removingId,
  onRemove,
}) {
  const isLeader = role === "Ministry Leader";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <p className="text-sm text-slate-500">
          {people.length} {isLeader ? "leader" : "member"}
          {people.length === 1 ? "" : "s"}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={people.length === 0}
            onClick={() => exportCsv(people, role)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={16} />
            Export Excel CSV
            <Download size={14} />
          </button>

          <button
            type="button"
            disabled={people.length === 0}
            onClick={() => printDirectory(people, role)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer size={16} />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {[
                "Person",
                "Member number",
                "Phone",
                "Assignment",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {people.map((person, index) => {
              const memberId = getAssignmentMemberId(person);

              const rowKey =
                person.assignment_id ??
                person.assignmentId ??
                `${memberId ?? "person"}-${index}`;

              const image = getProfileImage(person);
              const name = getMemberName(person);

              return (
                <tr
                  key={rowKey}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          {isLeader ? (
                            <ShieldCheck size={18} />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {name}
                        </p>

                        <p className="mt-0.5 break-all text-sm text-slate-500">
                          {getMemberEmail(person)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600 sm:px-5">
                    {getMemberNumber(person)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {getPhone(person)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {person.assignment_role || role}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      disabled={
                        memberId == null ||
                        removingId === String(memberId)
                      }
                      onClick={() => onRemove(person, role)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {removingId === String(memberId)
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {people.length === 0 && (
          <div className="px-5 py-10 text-center">
            <Users
              className="mx-auto text-slate-300"
              size={28}
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No {isLeader ? "leaders" : "members"} assigned yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Assign an existing church member to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
