const bcrypt = require("bcrypt");

const {
  TOKEN_TYPES,
  getValidAccountToken,
  consumeAccountToken,
} = require("./accountTokenService");

const { sendEmail } = require("./emailService");
const welcomeEmail = require("../templates/emails/welcomeEmail");
const { generateToken } = require("../utils/jwt");
const env = require("../config/env");

const { findById } = require("../models/userGoogleModel");
const { updatePassword } = require("../models/userPasswordModel");
const { markEmailVerified } = require("../models/userVerificationModel");
const { recordLogin } = require("../models/userActivityModel");

const SALT_ROUNDS = 10;

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const INVALID = "This invitation link is invalid or has expired.";

const loadInvitation = async (rawToken) => {
  const stored = await getValidAccountToken(rawToken, TOKEN_TYPES.INVITATION);

  if (!stored) {
    throw httpError(INVALID, 400);
  }

  const user = await findById(stored.user_id);

  if (!user || (user.is_active !== null && Number(user.is_active) === 0)) {
    throw httpError(INVALID, 400);
  }

  return { stored, user };
};

const checkInvitation = async (rawToken) => {
  const { user } = await loadInvitation(rawToken);

  return {
    firstName: user.first_name,
    email: user.email,
  };
};

const acceptInvitation = async (rawToken, password) => {
  const { stored, user } = await loadInvitation(rawToken);

  // A link works only once, even if two people click at the same moment.
  try {
    await consumeAccountToken(stored.id);
  } catch {
    throw httpError(INVALID, 400);
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  await updatePassword(user.id, hashed);

  // They received the link in their inbox, so the email is proven.
  await markEmailVerified(user.id);
  await recordLogin(user.id);

  const welcome = welcomeEmail({
    firstName: user.first_name,
    loginUrl: `${env.FRONTEND_URL}/login`,
  });

  // Background only: it must never delay or break setting a password.
  sendEmail({
    to: user.email,
    subject: welcome.subject,
    text: welcome.text,
    html: welcome.html,
  }).catch((error) => {
    console.error("Failed to send welcome email:", error.message);
  });

  return {
    user: {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email,
      roleId: user.role_id,
    },
    token: generateToken({
      id: user.id,
      roleId: user.role_id,
      email: user.email,
    }),
  };
};

module.exports = {
  checkInvitation,
  acceptInvitation,
};