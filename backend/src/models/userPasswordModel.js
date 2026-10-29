const db = require("../config/db");

const updatePassword = async (userId, hashedPassword) => {
  const [result] = await db.execute(
    `
      UPDATE users
      SET password = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [hashedPassword, userId]
  );

  return result.affectedRows > 0;
};

const getPasswordHashById = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT password, first_name, email
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

module.exports = {
  updatePassword,
  getPasswordHashById,
};