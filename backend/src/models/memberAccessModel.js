const db = require("../config/db");

const INVITE_VALID = `
  EXISTS (
    SELECT 1
    FROM account_tokens t
    WHERE t.user_id = u.id
      AND t.type = 'invitation'
      AND t.used_at IS NULL
      AND t.expires_at > NOW()
  )
`;

/*
 * Where each member stands, from most to least advanced:
 *  active          signed in at least once
 *  invited         a valid invitation link is waiting
 *  invite_expired  invited, link expired, email still unverified
 *  unverified      never verified their email
 *  never_signed_in verified but has not signed in yet
 */
const STATE_SQL = `
  CASE
    WHEN u.last_login_at IS NOT NULL THEN 'active'
    WHEN ${INVITE_VALID} THEN 'invited'
    WHEN u.email_verified_at IS NULL AND u.invited_at IS NOT NULL THEN 'invite_expired'
    WHEN u.email_verified_at IS NULL THEN 'unverified'
    ELSE 'never_signed_in'
  END
`;

const BASE = `
  SELECT
    m.id AS member_id,
    m.member_number,
    m.status AS member_status,
    m.created_at AS joined_at,
    u.id AS user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.role_id,
    r.name AS role_name,
    u.last_login_at,
    u.invited_at,
    u.invite_count,
    ${STATE_SQL} AS access_state
  FROM members m
  INNER JOIN users u ON u.id = m.user_id
  LEFT JOIN roles r ON r.id = u.role_id
`;

const FILTERS = {
  never: ["invited", "invite_expired", "unverified", "never_signed_in"],
  invited: ["invited"],
  expired: ["invite_expired"],
  unverified: ["unverified"],
  signed_in: ["active"],
};

const buildWhere = ({ filter, search }) => {
  const conditions = [];
  const params = [];

  const states = FILTERS[filter];

  if (states) {
    conditions.push("x.access_state IN (?)");
    params.push(states);
  }

  if (search) {
    conditions.push(`
      (
        x.first_name LIKE ?
        OR x.last_name LIKE ?
        OR CONCAT(x.first_name, ' ', x.last_name) LIKE ?
        OR x.email LIKE ?
        OR x.member_number LIKE ?
      )
    `);

    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const listAccess = async ({
  filter = "never",
  search = "",
  limit = 20,
  offset = 0,
}) => {
  const { where, params } = buildWhere({ filter, search });

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM (${BASE}) x ${where}`,
    params
  );

  const [rows] = await db.query(
    `
      SELECT x.*
      FROM (${BASE}) x
      ${where}
      ORDER BY x.joined_at DESC, x.member_id DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `,
    params
  );

  return { rows, total: Number(countRows[0]?.total || 0) };
};

const getSummary = async () => {
  const [rows] = await db.query(
    `SELECT x.access_state, COUNT(*) AS total FROM (${BASE}) x GROUP BY x.access_state`
  );

  return Object.fromEntries(
    rows.map((row) => [row.access_state, Number(row.total)])
  );
};

const TARGET_COLUMNS = `
  m.id AS member_id,
  m.status AS member_status,
  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.email,
  u.role_id,
  u.last_login_at,
  u.invited_at,
  TIMESTAMPDIFF(MINUTE, u.invited_at, NOW()) AS invited_minutes_ago
`;

const getTarget = async (memberId) => {
  const [rows] = await db.execute(
    `
      SELECT ${TARGET_COLUMNS}
      FROM members m
      INNER JOIN users u ON u.id = m.user_id
      WHERE m.id = ?
      LIMIT 1
    `,
    [memberId]
  );

  return rows[0] || null;
};

const getTargets = async (memberIds) => {
  const [rows] = await db.query(
    `
      SELECT ${TARGET_COLUMNS}
      FROM members m
      INNER JOIN users u ON u.id = m.user_id
      WHERE m.id IN (?)
    `,
    [memberIds]
  );

  return rows;
};

const markInvited = async (userId) => {
  await db.execute(
    `
      UPDATE users
      SET invited_at = NOW(),
          invite_count = invite_count + 1
      WHERE id = ?
    `,
    [userId]
  );
};

const setMemberStatus = async (memberId, status) => {
  await db.execute(
    `
      UPDATE members
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [status, memberId]
  );
};

const getUserName = async (userId) => {
  const [rows] = await db.execute(
    "SELECT first_name, last_name FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  const row = rows[0];

  return row ? `${row.first_name || ""} ${row.last_name || ""}`.trim() : "";
};

const isMinistryLeader = async (memberId) => {
  const [rows] = await db.execute(
    `
      SELECT 1
      FROM ministry_members
      WHERE member_id = ?
        AND assignment_role = 'Ministry Leader'
      LIMIT 1
    `,
    [memberId]
  );

  return rows.length > 0;
};

/*
 * Permanently removes an account that never signed in,
 * together with everything that only exists because of it.
 */
const deleteAccount = async (memberId, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      "DELETE FROM ministry_members WHERE member_id = ?",
      [memberId]
    );
    await connection.execute(
      "DELETE FROM announcement_recipients WHERE user_id = ?",
      [userId]
    );
    await connection.execute(
      "DELETE FROM account_tokens WHERE user_id = ?",
      [userId]
    );
    await connection.execute("DELETE FROM members WHERE id = ?", [memberId]);
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  listAccess,
  getSummary,
  getTarget,
  getTargets,
  markInvited,
  setMemberStatus,
  getUserName,
  isMinistryLeader,
  deleteAccount,
};