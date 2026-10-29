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

module.exports = {
  updatePassword,
};