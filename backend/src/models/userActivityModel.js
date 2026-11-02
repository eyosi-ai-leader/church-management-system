const db = require("../config/db");

const recordLogin = async (userId) => {
  await db.execute("UPDATE users SET last_login_at = NOW() WHERE id = ?", [
    userId,
  ]);
};

module.exports = {
  recordLogin,
};