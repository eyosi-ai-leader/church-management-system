/*
 * Same rules as the register and login forms (express-validator's
 * normalizeEmail), so the same person always maps to the same account.
 */
const normalizeEmail = (value) => {
  const email = String(value).trim().toLowerCase();
  const [local, domain] = email.split("@");

  if (!local || !domain) return email;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${local.split("+")[0].replace(/\./g, "")}@gmail.com`;
  }

  return email;
};

module.exports = normalizeEmail;