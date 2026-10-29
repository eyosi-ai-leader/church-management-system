const crypto = require("crypto");

const TOKEN_TYPES = {
  EMAIL_VERIFICATION: "email_verification",
  INVITATION: "invitation",
  PASSWORD_RESET: "password_reset",
};

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

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

const getExpirationDate = (minutes) => {
  const expiresAt = new Date();

  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

  return expiresAt;
};

/**
 * Generate a 6-digit one-time code (000000 to 999999).
 */
const generateOtp = () => {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
};

/**
 * Hash a one-time code together with the user's ID.
 * Only the hash is stored in the database.
 */
const hashOtp = (userId, code) => {
  return crypto
    .createHash("sha256")
    .update(`${userId}:${code}`)
    .digest("hex");
};

const verifyOtp = (userId, code, storedHash) => {
  if (!userId || !code || !storedHash) {
    return false;
  }

  const a = Buffer.from(hashOtp(userId, code), "hex");
  const b = Buffer.from(storedHash, "hex");

  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = {
  TOKEN_TYPES,
  generateToken,
  hashToken,
  verifyToken,
  getExpirationDate,
  generateOtp,
  hashOtp,
  verifyOtp,
};