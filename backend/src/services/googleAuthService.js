const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const memberService = require("./memberService");
const { sendEmail } = require("./emailService");
const welcomeEmail = require("../templates/emails/welcomeEmail");
const { generateToken } = require("../utils/jwt");
const env = require("../config/env");
const model = require("../models/userGoogleModel");

const SALT_ROUNDS = 10;

let client = null;

const getClient = () => {
  if (!client) client = new OAuth2Client();
  return client;
};

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

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

const splitName = (payload) => {
  const given = String(payload.given_name || "").trim();
  const family = String(payload.family_name || "").trim();

  if (given || family) {
    return {
      firstName: (given || family).slice(0, 100),
      lastName: (given && family ? family : "-").slice(0, 100),
    };
  }

  const parts = String(payload.name || "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return {
      firstName: String(payload.email).split("@")[0].slice(0, 100),
      lastName: "-",
    };
  }

  return {
    firstName: parts[0].slice(0, 100),
    lastName: (parts.slice(1).join(" ") || "-").slice(0, 100),
  };
};

const verifyCredential = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw httpError("Google sign-in is not set up on the server.", 503);
  }

  let ticket;

  try {
    ticket = await getClient().verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
  } catch (error) {
    console.error("Google token verification failed:", error.message);

    throw httpError(
      "We couldn't verify your Google sign-in. Please try again.",
      401
    );
  }

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw httpError("Your Google email address is not verified.", 401);
  }

  return payload;
};

const assertActive = (user) => {
  if (user.is_active !== null && Number(user.is_active) === 0) {
    throw httpError(
      "This account has been disabled. Please contact the church office.",
      403
    );
  }
};

const randomPassword = () => crypto.randomBytes(32).toString("hex");

const toSession = (user) => ({
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
});

const sendWelcome = (user) => {
  const content = welcomeEmail({
    firstName: user.first_name,
    loginUrl: `${env.FRONTEND_URL}/login`,
  });

  // Background only: it must never delay or break signing in.
  sendEmail({
    to: user.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  }).catch((error) => {
    console.error("Failed to send welcome email:", error.message);
  });
};

const signInWithGoogle = async (credential) => {
  const payload = await verifyCredential(credential);

  const googleId = payload.sub;
  const rawEmail = String(payload.email).trim().toLowerCase();
  const email = normalizeEmail(rawEmail);

  let user = await model.findByGoogleId(googleId);
  let isNew = false;

  if (!user) {
    user = await model.findByEmails([rawEmail, email]);

    if (user) {
      // Existing account with the same email: link it.
      assertActive(user);

      if (user.google_id && user.google_id !== googleId) {
        throw httpError(
          "This account is already linked to a different Google account.",
          409
        );
      }

      /*
       * If the email was never verified, someone else may have registered
       * it earlier. Replace that password so only the real owner (who just
       * proved it with Google) can get in.
       */
      const hash = user.email_verified_at
        ? null
        : await bcrypt.hash(randomPassword(), SALT_ROUNDS);

      await model.linkGoogleAccount(user.id, googleId, hash);
      user = await model.findById(user.id);
    } else {
      // Brand new person: create a Member account.
      const { firstName, lastName } = splitName(payload);

      const created = await memberService.createMember(
        {
          firstName,
          middleName: null,
          lastName,
          email,
          password: randomPassword(),

          // Google sign-in can NEVER create anything above a Member.
          roleId: 5,
          status: "Active",

          phone: null,
          gender: null,
          dateOfBirth: null,
          baptismDate: null,
          address: null,
        },
        null
      );

      await model.linkGoogleAccount(created.userId, googleId, null);
      user = await model.findById(created.userId);
      isNew = true;
    }
  }

  assertActive(user);

  if (isNew) sendWelcome(user);

  return { ...toSession(user), isNew };
};

module.exports = {
  signInWithGoogle,
};