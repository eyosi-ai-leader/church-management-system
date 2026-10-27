const pool = require("../config/db");

async function createPrayerRequest({ name, email, phone, message }) {
  const [result] = await pool.execute(
    `INSERT INTO prayer_requests (name, email, phone, message)
     VALUES (?, ?, ?, ?)`,
    [name, email, phone || null, message]
  );
  return result.insertId;
}

async function markNotification(id, sent) {
  await pool.execute(
    `UPDATE prayer_requests
     SET notification_status = ?, notified_at = ?
     WHERE id = ?`,
    [sent ? "sent" : "failed", sent ? new Date() : null, id]
  );
}

module.exports = { createPrayerRequest, markNotification };