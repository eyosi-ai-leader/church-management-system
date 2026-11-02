const db = require("../config/db");

const COLUMNS = `
  id,
  first_name,
  middle_name,
  last_name,
  email,
  role_id,
  is_active,
  google_id,
  email_verified_at
`;

const findByGoogleId = async (googleId) => {
  const [rows] = await db.execute(
    `SELECT ${COLUMNS} FROM users WHERE google_id = ? LIMIT 1`,
    [googleId]
  );

  return rows[0] || null;
};

/*
 * Looks up an account by any of the given email forms
 * (as Google reports it, and in the normalized form the
 * register form stores). The first form is preferred.
 */
const findByEmails = async (emails) => {
  const unique = [...new Set(emails.map((email) => email.toLowerCase()))];

  const [rows] = await db.query(
    `
      SELECT ${COLUMNS}
      FROM users
      WHERE LOWER(email) IN (?)
      ORDER BY (LOWER(email) = ?) DESC, id ASC
      LIMIT 1
    `,
    [unique, unique[0]]
  );

  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT ${COLUMNS} FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

/*
 * Links a Google account and marks the email as verified.
 * When passwordHash is given, the old password is replaced.
 */
const linkGoogleAccount = async (userId, googleId, passwordHash = null) => {
  if (passwordHash) {
    await db.execute(
      `
        UPDATE users
        SET google_id = ?,
            email_verified_at = COALESCE(email_verified_at, NOW()),
            password = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [googleId, passwordHash, userId]
    );

    return;
  }

  await db.execute(
    `
      UPDATE users
      SET google_id = ?,
          email_verified_at = COALESCE(email_verified_at, NOW()),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [googleId, userId]
  );
};

module.exports = {
  findByGoogleId,
  findByEmails,
  findById,
  linkGoogleAccount,
};