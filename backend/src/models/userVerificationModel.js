const db = require("../config/db");

const markEmailVerified = async (userId) => {
  await db.execute(
    `
      UPDATE users
      SET email_verified_at = NOW()
      WHERE id = ?
        AND email_verified_at IS NULL
    `,
    [userId]
  );
};

const isEmailVerified = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT email_verified_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId]
  );

  return Boolean(rows[0]?.email_verified_at);
};

module.exports = {
  markEmailVerified,
  isEmailVerified,
};