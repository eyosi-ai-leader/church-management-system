const db = require("../config/db");

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  const query = `
    SELECT
      id,
      first_name,
      middle_name,
      last_name,
      email,
      password,
      role_id,
      is_active
    FROM users
    WHERE email = ?
  `;

  const [rows] =
    await db.execute(
      query,
      [email]
    );

  return rows[0];
};

/**
 * Create new user
 */
const createUser = async (
  userData
) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    roleId,
    phone,
    profileImage,
  } = userData;

  const query = `
    INSERT INTO users
    (
      first_name,
      middle_name,
      last_name,
      email,
      password,
      role_id,
      phone,
      profile_image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] =
    await db.execute(
      query,
      [
        firstName,
        middleName || null,
        lastName,
        email,
        password,
        roleId,
        phone || null,
        profileImage || null,
      ]
    );

  return result.insertId;
};

/**
 * Find user by ID
 */
const findUserById = async (
  id
) => {
  const query = `
    SELECT
      id,
      first_name,
      middle_name,
      last_name,
      email,
      role_id,
      phone,
      profile_image,
      email_verified,
      is_active,
      last_login,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
  `;

  const [rows] =
    await db.execute(
      query,
      [id]
    );

  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};