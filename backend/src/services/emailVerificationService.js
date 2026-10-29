const {
  TOKEN_TYPES,
  generateOtp,
  hashOtp,
  verifyOtp,
  getExpirationDate,
} = require("../utils/accountToken");

const tokenModel = require("../models/accountTokenModel");
const { findUserByEmail } = require("../models/userModel");
const {
  markEmailVerified,
  isEmailVerified,
} = require("../models/userVerificationModel");

const { sendEmail } = require("./emailService");
const verificationCodeEmail = require("../templates/emails/verificationCodeEmail");
const welcomeEmail = require("../templates/emails/welcomeEmail");
const env = require("../config/env");

const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 60;

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Create a new 6-digit code for a user and email it.
 * user = { id, firstName, email }
 */
const sendVerificationCode = async ({ id, firstName, email }) => {
  const code = generateOtp();

  await tokenModel.deleteUnusedTokensByUserAndType(
    id,
    TOKEN_TYPES.EMAIL_VERIFICATION
  );

  await tokenModel.createToken({
    userId: id,
    tokenHash: hashOtp(id, code),
    type: TOKEN_TYPES.EMAIL_VERIFICATION,
    expiresAt: getExpirationDate(CODE_MINUTES),
  });

  const content = verificationCodeEmail({
    firstName,
    code,
    minutes: CODE_MINUTES,
  });

  await sendEmail({
    to: email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
};

/**
 * Check the code entered by the member.
 */
const verifyEmailCode = async (email, code) => {
  const invalid = () => httpError("Invalid or expired code.", 400);

  const user = await findUserByEmail(email);

  if (!user) {
    throw invalid();
  }

  if (await isEmailVerified(user.id)) {
    return { alreadyVerified: true };
  }

  const token = await tokenModel.findLatestActiveTokenByUser(
    user.id,
    TOKEN_TYPES.EMAIL_VERIFICATION
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

  const consumed = await tokenModel.markTokenAsUsed(token.id);

  if (!consumed) {
    throw invalid();
  }

  await markEmailVerified(user.id);

  // Welcome email: background only, never blocks or breaks verification.
  const welcome = welcomeEmail({
    firstName: user.first_name,
    loginUrl: `${env.FRONTEND_URL}/login`,
  });

  sendEmail({
    to: user.email,
    subject: welcome.subject,
    text: welcome.text,
    html: welcome.html,
  }).catch((error) => {
    console.error("Failed to send welcome email:", error.message);
  });

  return { alreadyVerified: false };
};

/**
 * Send a fresh code. Silent if the email is unknown or already verified,
 * so the endpoint cannot be used to discover which emails have accounts.
 */
const resendVerificationCode = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  if (await isEmailVerified(user.id)) {
    return;
  }

  const token = await tokenModel.findLatestActiveTokenByUser(
    user.id,
    TOKEN_TYPES.EMAIL_VERIFICATION
  );

  if (token && Number(token.age_seconds) < RESEND_SECONDS) {
    const wait = RESEND_SECONDS - Number(token.age_seconds);
    throw httpError(
      `Please wait ${wait} seconds before requesting another code.`,
      429
    );
  }

  await sendVerificationCode({
    id: user.id,
    firstName: user.first_name,
    email: user.email,
  });
};

module.exports = {
  sendVerificationCode,
  verifyEmailCode,
  resendVerificationCode,
};