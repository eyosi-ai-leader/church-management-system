const db = require("../config/db");

/*
 * Announcements this person can see in the dashboard:
 * delivered to them, not deleted, and not "email only".
 */
const VISIBLE = `
  FROM announcement_recipients ar
  INNER JOIN announcements a ON a.id = ar.announcement_id
  INNER JOIN users u ON u.id = a.created_by
  LEFT JOIN roles r ON r.id = u.role_id
  WHERE ar.user_id = ?
    AND a.deleted_at IS NULL
    AND a.delivery IN ('both', 'dashboard')
`;

const COLUMNS = `
  a.id,
  a.subject,
  a.message,
  a.created_at,
  u.first_name,
  u.last_name,
  r.name AS sender_role,
  ar.read_at
`;

const listInbox = async ({
  userId,
  unreadOnly = false,
  limit = 15,
  offset = 0,
}) => {
  const extra = unreadOnly ? " AND ar.read_at IS NULL" : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total ${VISIBLE}${extra}`,
    [userId]
  );

  const [rows] = await db.query(
    `
      SELECT ${COLUMNS}
      ${VISIBLE}${extra}
      ORDER BY a.id DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `,
    [userId]
  );

  return { rows, total: Number(countRows[0]?.total || 0) };
};

const countUnread = async (userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total ${VISIBLE} AND ar.read_at IS NULL`,
    [userId]
  );

  return Number(rows[0]?.total || 0);
};

const getInboxItem = async (userId, announcementId) => {
  const [rows] = await db.query(
    `SELECT ${COLUMNS} ${VISIBLE} AND a.id = ? LIMIT 1`,
    [userId, announcementId]
  );

  return rows[0] || null;
};

const markRead = async (userId, announcementId) => {
  await db.execute(
    `
      UPDATE announcement_recipients ar
      INNER JOIN announcements a ON a.id = ar.announcement_id
      SET ar.read_at = NOW()
      WHERE ar.user_id = ?
        AND ar.announcement_id = ?
        AND ar.read_at IS NULL
        AND a.deleted_at IS NULL
        AND a.delivery IN ('both', 'dashboard')
    `,
    [userId, announcementId]
  );
};

const markAllRead = async (userId) => {
  await db.execute(
    `
      UPDATE announcement_recipients ar
      INNER JOIN announcements a ON a.id = ar.announcement_id
      SET ar.read_at = NOW()
      WHERE ar.user_id = ?
        AND ar.read_at IS NULL
        AND a.deleted_at IS NULL
        AND a.delivery IN ('both', 'dashboard')
    `,
    [userId]
  );
};

module.exports = {
  listInbox,
  countUnread,
  getInboxItem,
  markRead,
  markAllRead,
};