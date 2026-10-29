const bcrypt = require("bcrypt");

const {
  TOKEN_TYPES,
  generateOtp,
  hashOtp,
  verifyOtp,
  getExpirationDate,
} = require("../utils/accountToken");

const tokenModel = require("../models/accountTokenModel");
const { findUserByEmail } = require("../models/userModel");
const { updatePassword } = require("../models/userPasswordModel");
const { markEmailVerified } = require("../models/userVerificationModel");

const { sendEmail } = require("./emailService");
const passwordResetEmail = require("../templates/emails/passwordResetEmail");

const CODE_MINUTES = 15;
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 60;
const SALT_ROUNDS = 10;

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Send a reset code if the account exists.
 *
 * This function never reveals whether the email has an account:
 * it returns normally in every case. The email is sent in the
 * background so the response is fast and consistent.
 */
const requestPasswordReset = async (email) => {
  const user = await findUserByEmail(email);

  if (!user || user.is_active === 0) {
    return;
  }

  const existing = await tokenModel.findLatestActiveTokenByUser(
    user.id,
    TOKEN_TYPES.PASSWORD_RESET
  );

  // Too soon after the previous code: skip silently.
  if (existing && Number(existing.age_seconds) < RESEND_SECONDS) {
    return;
  }

  const code = generateOtp();

  await tokenModel.deleteUnusedTokensByUserAndType(
    user.id,
    TOKEN_TYPES.PASSWORD_RESET
  );

  await tokenModel.createToken({
    userId: user.id,
    tokenHash: hashOtp(user.id, code),
    type: TOKEN_TYPES.PASSWORD_RESET,
    expiresAt: getExpirationDate(CODE_MINUTES),
  });

  const content = passwordResetEmail({
    firstName: user.first_name,
    code,
    minutes: CODE_MINUTES,
  });

  sendEmail({
    to: user.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  }).catch((error) => {
    console.error("Failed to send password reset code:", error.message);
  });
};

/**
 * Check the code and set the new password.
 */
const resetPassword = async (email, code, newPassword) => {
  const invalid = () => httpError("Invalid or expired code.", 400);

  const user = await findUserByEmail(email);

  if (!user) {
    throw invalid();
  }

  const token = await tokenModel.findLatestActiveTokenByUser(
    user.id,
    TOKEN_TYPES.PASSWORD_RESET
  );

  if (!token) {
    throw invalid();
  }

  if (token.attempts >= MAX_ATTEMPTS) {
    throw httpError(
      "Too many incorrect attempts. Please request a new code.",
      429
    );
  }

  if (!verifyOtp(user.id, code, token.token_hash)) {
    await tokenModel.incrementTokenAttempts(token.id);
    throw invalid();
  }

  // A code can be used only once.
  const consumed = await tokenModel.markTokenAsUsed(token.id);

  if (!consumed) {
    throw invalid();
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await updatePassword(user.id, hashed);

  // They proved they own this inbox, so the email counts as verified.
  await markEmailVerified(user.id);
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};