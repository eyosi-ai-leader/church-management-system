export const PASSWORD_RULES = [
  {
    id: "length",
    label: "8 to 72 characters",
    test: (value) => value.length >= 8 && value.length <= 72,
  },
  {
    id: "upper",
    label: "One uppercase letter (A-Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "One lowercase letter (a-z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "One number (0-9)",
    test: (value) => /\d/.test(value),
  },
  {
    id: "symbol",
    label: "One symbol (! @ # $ % ...)",
    test: (value) => /[^A-Za-z0-9\s]/.test(value),
  },
];

export const PASSWORD_RULES_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.";

export function isStrongPassword(value) {
  return PASSWORD_RULES.every((rule) => rule.test(value || ""));
}