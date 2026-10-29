const {
  findUserByEmail,
} = require("../models/userModel");

const memberService = require("./memberService");

const {
  sendVerificationCode,
} = require("./emailVerificationService");

const {
  isEmailVerified,
} = require("../models/userVerificationModel");

/**
 * Register a new public church member.
 *
 * Public registration rules:
 * - roleId is ALWAYS 5 (Member)
 * - status is ALWAYS Active
 * - password is hashed inside memberService
 * - profile image is handled by memberService
 * - users + members are created together
 * - a 6-digit verification code is emailed after account creation
 * - the account cannot log in until the code is confirmed
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

  let verificationEmailSent = true;

  try {
    await sendVerificationCode({
      id: result.userId,
      firstName,
      email,
    });
  } catch (error) {
    verificationEmailSent = false;

    console.error(
      "Failed to send verification code:",
      error.message
    );
  }

  return {
    message: verificationEmailSent
      ? "Registration successful. We sent a 6-digit verification code to your email."
      : "Registration successful, but the verification code could not be sent. Please request a new code.",
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

  /*
   * The password is correct, but the email must be confirmed
   * with the 6-digit code before the account can be used.
   */
  const verified = await isEmailVerified(user.id);

  if (!verified) {
    const error = new Error(
      "Please verify your email before signing in."
    );

    error.statusCode = 403;

    throw error;
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