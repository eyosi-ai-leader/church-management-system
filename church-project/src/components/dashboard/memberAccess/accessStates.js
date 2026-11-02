export const ACCESS_STATES = {
  invited: {
    label: "Invitation pending",
    className: "bg-blue-50 text-blue-700",
  },
  invite_expired: {
    label: "Invitation expired",
    className: "bg-amber-50 text-amber-700",
  },
  unverified: {
    label: "Email not verified",
    className: "bg-amber-50 text-amber-700",
  },
  never_signed_in: {
    label: "Never signed in",
    className: "bg-slate-100 text-slate-600",
  },
  active: {
    label: "Signed in",
    className: "bg-emerald-50 text-emerald-700",
  },
};

// `count` tells the page which number from the summary to show.
export const FILTERS = [
  { id: "never", label: "Never signed in", count: "neverSignedIn" },
  { id: "invited", label: "Invitation pending", count: "invited" },
  { id: "expired", label: "Invitation expired", count: "expired" },
  { id: "unverified", label: "Email not verified", count: "unverified" },
  { id: "signed_in", label: "Signed in", count: "signedIn" },
  { id: "all", label: "All members", count: "total" },
];

// Stops spreadsheet programs from running a cell as a formula.
export const csvCell = (value) => {
  let text = String(value ?? "");

  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
};