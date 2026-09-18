const crypto = require("crypto");

const TOKEN_TYPES = {
  EMAIL_VERIFICATION: "email_verification",
  INVITATION: "invitation",
  PASSWORD_RESET: "password_reset",
};

/**
 * Generate a cryptographically secure random token.
 *
 * The raw token is returned to the application so it can be
 * sent to the user by email/link.
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a token before storing it in the database.
 *
 * We never store the raw token in account_tokens.
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Compare a provided raw token with a stored token hash.
 */
const verifyToken = (token, tokenHash) => {
  if (!token || !tokenHash) {
    return false;
  }

  const hashedToken = hashToken(token);

  return crypto.timingSafeEqual(
    Buffer.from(hashedToken, "hex"),
    Buffer.from(tokenHash, "hex")
  );
};

/**
 * Calculate an expiration date from the current time.
 *
 * @param {number} minutes - Number of minutes until expiration.
 */
const getExpirationDate = (minutes) => {
  const expiresAt = new Date();

  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

  return expiresAt;
};

module.exports = {
  TOKEN_TYPES,
  generateToken,
  hashToken,
  verifyToken,
  getExpirationDate,
};

