const db = require("../config/db");

/*
 * Anyone who can see an announcement in the dashboard:
 * active member with an enabled account.
 */
const ACTIVE_BASE = `
  FROM members m
  INNER JOIN users u ON u.id = m.user_id
  WHERE m.status = 'Active'
    AND (u.is_active IS NULL OR u.is_active = 1)
`;

const VERIFIED = " AND u.email_verified_at IS NOT NULL";

/*
 * "Email only" announcements need a verified address.
 * Anything shown in the dashboard does not.
 */
const baseFor = (delivery) =>
  delivery === "email" ? `${ACTIVE_BASE}${VERIFIED}` : ACTIVE_BASE;

const IN_MINISTRIES = `
  AND m.id IN (
    SELECT mm.member_id
    FROM ministry_members mm
    WHERE mm.ministry_id IN (?)
      AND mm.status = 'Active'
  )
`;

const SUMMARY_SELECT = `
  SELECT
    a.id,
    a.subject,
    a.message,
    a.audience_label,
    a.delivery,
    a.status,
    a.total_recipients,
    a.email_total,
    a.sent_count,
    a.failed_count,
    a.skipped_opted_out,
    a.created_at,
    a.completed_at,
    (
      SELECT COUNT(*)
      FROM announcement_recipients rr
      WHERE rr.announcement_id = a.id
        AND rr.read_at IS NOT NULL
    ) AS read_count,
    u.first_name,
    u.last_name
  FROM announcements a
  INNER JOIN users u ON u.id = a.created_by
`;

const getLedMinistries = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT DISTINCT mi.id, mi.name
      FROM members m
      INNER JOIN ministry_members mm
        ON mm.member_id = m.id
        AND mm.assignment_role = 'Ministry Leader'
        AND mm.status = 'Active'
      INNER JOIN ministries mi
        ON mi.id = mm.ministry_id
        AND mi.status = 'Active'
      WHERE m.user_id = ?
      ORDER BY mi.name
    `,
    [userId]
  );

  return rows;
};

const getMinistries = async (ids = null) => {
  let sql = `
    SELECT
      mi.id,
      mi.name,
      (
        SELECT COUNT(*)
        FROM ministry_members mm
        WHERE mm.ministry_id = mi.id
          AND mm.status = 'Active'
      ) AS member_count
    FROM ministries mi
    WHERE mi.status = 'Active'
  `;

  const params = [];

  if (ids) {
    sql += " AND mi.id IN (?)";
    params.push(ids);
  }

  sql += " ORDER BY mi.name";

  const [rows] = await db.query(sql, params);

  return rows;
};

const getMinistryNames = async (ids) => {
  const [rows] = await db.query(
    "SELECT name FROM ministries WHERE id IN (?) ORDER BY name",
    [ids]
  );

  return rows.map((row) => row.name);
};

/*
 * Browse or search members who can be reached, one page at a time.
 */
const searchMembers = async ({
  search = "",
  ministryIds = null,
  limit = 25,
  offset = 0,
  delivery = "both",
}) => {
  const base = baseFor(delivery);

  let conditions = "";
  const params = [];

  if (ministryIds) {
    conditions += IN_MINISTRIES;
    params.push(ministryIds);
  }

  if (search) {
    conditions += `
      AND (
        u.first_name LIKE ?
        OR u.last_name LIKE ?
        OR CONCAT(u.first_name, ' ', u.last_name) LIKE ?
        OR u.email LIKE ?
        OR m.member_number LIKE ?
      )
    `;

    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total ${base} ${conditions}`,
    params
  );

  const [rows] = await db.query(
    `
      SELECT
        m.id,
        m.member_number,
        u.first_name,
        u.last_name,
        u.email
      ${base}
      ${conditions}
      ORDER BY u.first_name, u.last_name, m.id
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `,
    params
  );

  return { rows, total: Number(countRows[0]?.total || 0) };
};

/*
 * Totals that explain why fewer people can be reached than appear
 * in the Members table. "active" and "inactive" never overlap.
 */
const getMemberStats = async ({ restrictMinistryIds = null } = {}) => {
  let sql = `
    SELECT
      COUNT(*) AS total,
      SUM(m.status <> 'Active' OR COALESCE(u.is_active, 1) = 0) AS inactive,
      SUM(
        m.status = 'Active'
        AND COALESCE(u.is_active, 1) = 1
      ) AS active,
      SUM(
        m.status = 'Active'
        AND COALESCE(u.is_active, 1) = 1
        AND u.email_verified_at IS NULL
      ) AS not_verified
    FROM members m
    INNER JOIN users u ON u.id = m.user_id
    WHERE 1 = 1
  `;

  const params = [];

  if (restrictMinistryIds) {
    sql += IN_MINISTRIES;
    params.push(restrictMinistryIds);
  }

  const [rows] = await db.query(sql, params);
  const row = rows[0] || {};

  return {
    total: Number(row.total || 0),
    inactive: Number(row.inactive || 0),
    active: Number(row.active || 0),
    notVerified: Number(row.not_verified || 0),
  };
};

/*
 * Members that match a search but cannot be reached,
 * so the picker can explain why they are missing.
 */
const searchIneligibleMembers = async ({
  search,
  ministryIds = null,
  limit = 5,
  delivery = "both",
}) => {
  const term = `%${search}%`;

  const reachable =
    delivery === "email"
      ? `m.status = 'Active' AND COALESCE(u.is_active, 1) = 1 AND u.email_verified_at IS NOT NULL`
      : `m.status = 'Active' AND COALESCE(u.is_active, 1) = 1`;

  let sql = `
    SELECT
      m.id,
      m.member_number,
      m.status AS member_status,
      u.first_name,
      u.last_name,
      u.email,
      u.is_active,
      u.email_verified_at
    FROM members m
    INNER JOIN users u ON u.id = m.user_id
    WHERE NOT (${reachable})
    AND (
      u.first_name LIKE ?
      OR u.last_name LIKE ?
      OR CONCAT(u.first_name, ' ', u.last_name) LIKE ?
      OR u.email LIKE ?
      OR m.member_number LIKE ?
    )
  `;

  const params = [term, term, term, term, term];

  if (ministryIds) {
    sql += IN_MINISTRIES;
    params.push(ministryIds);
  }

  sql += ` ORDER BY u.first_name, u.last_name LIMIT ${Number(limit)}`;

  const [rows] = await db.query(sql, params);

  return rows;
};

const resolveRecipients = async ({
  type,
  ministryIds = [],
  memberIds = [],
  restrictMinistryIds = null,
  delivery = "both",
}) => {
  let sql = `
    SELECT DISTINCT
      u.id AS user_id,
      u.email,
      u.first_name,
      u.announcement_emails,
      u.email_verified_at
    ${baseFor(delivery)}
  `;

  const params = [];

  if (restrictMinistryIds) {
    sql += IN_MINISTRIES;
    params.push(restrictMinistryIds);
  }

  if (type === "ministries") {
    sql += IN_MINISTRIES;
    params.push(ministryIds);
  }

  if (type === "members") {
    sql += " AND m.id IN (?)";
    params.push(memberIds);
  }

  const [rows] = await db.query(sql, params);

  return rows;
};

/*
 * Emails already planned or sent today (counts toward the daily cap).
 * Dashboard-only recipients are "skipped" and are not counted.
 */
const countPlannedToday = async () => {
  const [rows] = await db.execute(
    `
      SELECT COUNT(*) AS total
      FROM announcement_recipients ar
      INNER JOIN announcements a ON a.id = ar.announcement_id
      WHERE a.created_at >= CURDATE()
        AND ar.status IN ('sent', 'pending')
    `
  );

  return Number(rows[0]?.total || 0);
};

/*
 * recipients: [{ userId, emailStatus: 'pending' | 'skipped', read: boolean }]
 */
const createAnnouncementWithRecipients = async ({
  createdBy,
  subject,
  message,
  audienceLabel,
  delivery,
  recipients,
  emailTotal,
  skippedOptedOut,
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const noEmails = emailTotal === 0;

    const [result] = await connection.execute(
      `
        INSERT INTO announcements (
          created_by,
          subject,
          message,
          audience_label,
          delivery,
          total_recipients,
          email_total,
          skipped_opted_out,
          status,
          completed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        createdBy,
        subject,
        message,
        audienceLabel,
        delivery,
        recipients.length,
        emailTotal,
        skippedOptedOut,
        noEmails ? "sent" : "sending",
        noEmails ? new Date() : null,
      ]
    );

    const announcementId = result.insertId;

    await connection.query(
      "INSERT INTO announcement_recipients (announcement_id, user_id, status, read_at) VALUES ?",
      [
        recipients.map((recipient) => [
          announcementId,
          recipient.userId,
          recipient.emailStatus,
          recipient.read ? new Date() : null,
        ]),
      ]
    );

    await connection.commit();

    return announcementId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAnnouncementForSend = async (id) => {
  const [rows] = await db.execute(
    `
      SELECT
        a.id,
        a.subject,
        a.message,
        u.first_name AS sender_first_name,
        u.last_name AS sender_last_name,
        u.email AS sender_email,
        r.name AS sender_role
      FROM announcements a
      INNER JOIN users u ON u.id = a.created_by
      LEFT JOIN roles r ON r.id = u.role_id
      WHERE a.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};

const getAnnouncementBasic = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, created_by FROM announcements WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );

  return rows[0] || null;
};

const getAnnouncementById = async (id) => {
  const [rows] = await db.query(
    `${SUMMARY_SELECT} WHERE a.id = ? AND a.deleted_at IS NULL LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const getRecipients = async (announcementId) => {
  const [rows] = await db.query(
    `
      SELECT
        ar.id,
        ar.status,
        ar.error,
        ar.sent_at,
        ar.read_at,
        u.first_name,
        u.last_name,
        u.email,
        u.announcement_emails,
        u.email_verified_at
      FROM announcement_recipients ar
      INNER JOIN users u ON u.id = ar.user_id
      WHERE ar.announcement_id = ?
      ORDER BY
        FIELD(ar.status, 'failed', 'pending', 'sent', 'skipped'),
        u.first_name,
        u.last_name
    `,
    [announcementId]
  );

  return rows;
};

const getPendingBatch = async (announcementId, limit) => {
  const [rows] = await db.query(
    `
      SELECT ar.id, ar.user_id, u.email, u.first_name
      FROM announcement_recipients ar
      INNER JOIN users u ON u.id = ar.user_id
      WHERE ar.announcement_id = ?
        AND ar.status = 'pending'
      ORDER BY ar.id
      LIMIT ${Number(limit)}
    `,
    [announcementId]
  );

  return rows;
};

const markRecipient = async (recipientId, ok, error = "") => {
  await db.execute(
    `
      UPDATE announcement_recipients
      SET status = ?, error = ?, sent_at = ?
      WHERE id = ?
    `,
    [
      ok ? "sent" : "failed",
      ok ? null : String(error).slice(0, 255),
      ok ? new Date() : null,
      recipientId,
    ]
  );
};

const refreshCounts = async (announcementId) => {
  const [rows] = await db.execute(
    `
      SELECT
        SUM(status = 'sent') AS sent,
        SUM(status = 'failed') AS failed,
        SUM(status = 'pending') AS pending
      FROM announcement_recipients
      WHERE announcement_id = ?
    `,
    [announcementId]
  );

  const counts = {
    sent: Number(rows[0]?.sent || 0),
    failed: Number(rows[0]?.failed || 0),
    pending: Number(rows[0]?.pending || 0),
  };

  await db.execute(
    "UPDATE announcements SET sent_count = ?, failed_count = ? WHERE id = ?",
    [counts.sent, counts.failed, announcementId]
  );

  return counts;
};

const finishAnnouncement = async (announcementId, status) => {
  await db.execute(
    "UPDATE announcements SET status = ?, completed_at = NOW() WHERE id = ?",
    [status, announcementId]
  );
};

const markAnnouncementSending = async (announcementId) => {
  await db.execute(
    "UPDATE announcements SET status = 'sending', completed_at = NULL WHERE id = ?",
    [announcementId]
  );
};

const resetFailedToPending = async (announcementId) => {
  await db.execute(
    `
      UPDATE announcement_recipients
      SET status = 'pending', error = NULL
      WHERE announcement_id = ? AND status = 'failed'
    `,
    [announcementId]
  );

  await markAnnouncementSending(announcementId);
};

/*
 * Retry one person. Returns true if a failed recipient was reset.
 */
const resetRecipientToPending = async (announcementId, recipientId) => {
  const [result] = await db.execute(
    `
      UPDATE announcement_recipients
      SET status = 'pending', error = NULL
      WHERE id = ? AND announcement_id = ? AND status = 'failed'
    `,
    [recipientId, announcementId]
  );

  if (result.affectedRows === 0) return false;

  await markAnnouncementSending(announcementId);

  return true;
};

const listAnnouncements = async ({
  createdBy = null,
  search = "",
  limit = 20,
  offset = 0,
} = {}) => {
  let where = " WHERE a.deleted_at IS NULL";
  const params = [];

  if (createdBy) {
    where += " AND a.created_by = ?";
    params.push(createdBy);
  }

  if (search) {
    where += " AND (a.subject LIKE ? OR a.audience_label LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM announcements a${where}`,
    params
  );

  const [rows] = await db.query(
    `${SUMMARY_SELECT}${where} ORDER BY a.id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    params
  );

  return { rows, total: Number(countRows[0]?.total || 0) };
};

const softDeleteAnnouncement = async (id) => {
  await db.execute(
    "UPDATE announcements SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
};

const getUserContact = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT first_name, last_name, email
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

module.exports = {
  getLedMinistries,
  getMinistries,
  getMinistryNames,
  searchMembers,
  getMemberStats,
  searchIneligibleMembers,
  resolveRecipients,
  countPlannedToday,
  createAnnouncementWithRecipients,
  getAnnouncementForSend,
  getAnnouncementBasic,
  getAnnouncementById,
  getRecipients,
  getPendingBatch,
  markRecipient,
  refreshCounts,
  finishAnnouncement,
  resetFailedToPending,
  resetRecipientToPending,
  listAnnouncements,
  softDeleteAnnouncement,
  getUserContact,
};