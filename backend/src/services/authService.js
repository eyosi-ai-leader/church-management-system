const {
  findUserByEmail,
} = require("../models/userModel");

const memberService = require("./memberService");

const {
  TOKEN_TYPES,
  createAccountToken,
} = require("./accountTokenService");

const {
  sendEmail,
} = require("./emailService");

const verificationEmail = require(
  "../templates/emails/verificationEmail"
);

const welcomeEmail = require(
  "../templates/emails/welcomeEmail"
);

const env = require("../config/env");

/**
 * Register a new public church member.
 *
 * Public registration rules:
 * - roleId is ALWAYS 5 (Member)
 * - status is ALWAYS Active
 * - password is hashed inside memberService
 * - profile image is handled by memberService
 * - users + members are created together
 * - email verification token is created after account creation
 * - verification email is sent after token creation
 * - welcome email is sent in the background
 */
const registerUser = async (
  userData,
  profileImage = null
) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    phone,
    gender,
    dateOfBirth,
    baptismDate,
    address,
  } = userData;

  const existingUser =
    await findUserByEmail(email);

  if (existingUser) {
    const error = new Error(
      "Email already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const result =
    await memberService.createMember(
      {
        firstName,
        middleName,
        lastName,
        email,
        password,

        // Public users can NEVER choose these.
        roleId: 5,
        status: "Active",

        phone,
        gender,
        dateOfBirth,
        baptismDate,
        address,
      },
      profileImage
    );

  const verificationToken =
    await createAccountToken(
      result.userId,
      TOKEN_TYPES.EMAIL_VERIFICATION
    );

  const verificationUrl =
    `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(
      verificationToken.token
    )}`;

  const emailContent =
    verificationEmail({
      firstName,
      verificationUrl,
    });

  /*
   * The account already exists. An email failure must NOT
   * make registration appear to have failed.
   */
  let verificationEmailSent = true;

  try {
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
  } catch (error) {
    verificationEmailSent = false;

    console.error(
      "Failed to send verification email:",
      error.message
    );
  }

  /*
   * Welcome email: background only (not awaited), so the
   * visitor never waits for it and a failure never breaks signup.
   */
  const welcomeContent = welcomeEmail({
    firstName,
    loginUrl: `${env.FRONTEND_URL}/login`,
  });

  sendEmail({
    to: email,
    subject: welcomeContent.subject,
    text: welcomeContent.text,
    html: welcomeContent.html,
  }).catch((error) => {
    console.error(
      "Failed to send welcome email:",
      error.message
    );
  });

  return {
    message: verificationEmailSent
      ? "Registration successful. Please check your email to verify your account."
      : "Registration successful, but the verification email could not be sent. Please request a new verification email.",
    verificationEmailSent,
    user: {
      firstName,
      middleName: middleName || null,
      lastName,
      email,
      roleId: 5,
      role: "Member",
      status: "Active",
      memberId: result.memberId,
      memberNumber: result.memberNumber,
    },
  };
};

const loginUser = async (
  userData
) => {
  const {
    email,
    password,
  } = userData;

  const user =
    await findUserByEmail(email);

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const bcrypt = require("bcrypt");

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const {
    generateToken,
  } = require("../utils/jwt");

  const token = generateToken({
    id: user.id,
    roleId: user.role_id,
    email: user.email,
  });

  return {
    message: "Login successful",
    user: {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email,
      roleId: user.role_id,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};