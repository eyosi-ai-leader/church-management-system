const {
  findUserByEmail,
} = require("../models/userModel");

const memberService = require("./memberService");

/**
 * Register a new public church member.
 *
 * Public registration rules:
 * - roleId is ALWAYS 5 (Member)
 * - status is ALWAYS Active
 * - password is hashed inside memberService
 * - profile image is handled by memberService
 * - users + members are created together
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

  return {
    message:
      "Registration successful. Your member account has been created.",
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

const loginUser = async (userData) => {
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