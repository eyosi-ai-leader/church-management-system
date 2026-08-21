const {
  findUserByEmail,
  createUser,
} = require("../models/userModel");

const {
  hashPassword,
  comparePassword,
} = require("../utils/password");

const { generateToken } = require("../utils/jwt");

// Register User
const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = userData;

  // Check if email already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Default role = Member
  const roleId = 5;

  // Save user
  const userId = await createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roleId,
  });

  return {
    message: "User registered successfully",
    user: {
      id: userId,
      firstName,
      lastName,
      email,
      role: "Member",
    },
  };
};

// Login User
const loginUser = async (userData) => {
  const { email, password } = userData;

  // Find user
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
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