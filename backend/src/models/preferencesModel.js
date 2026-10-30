const db = require("../config/db");

const getAnnouncementPreference = async (userId) => {
  const [rows] = await db.execute(
    "SELECT announcement_emails FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!rows[0]) return null;

  return Number(rows[0].announcement_emails) === 1;
};

const setAnnouncementPreference = async (userId, enabled) => {
  await db.execute(
    "UPDATE users SET announcement_emails = ? WHERE id = ?",
    [enabled ? 1 : 0, userId]
  );
};

module.exports = {
  getAnnouncementPreference,
  setAnnouncementPreference,
};