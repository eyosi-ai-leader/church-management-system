const db = require("../config/db");

const { DEFAULT_MINUTES } = require("../utils/churchTime");

const CANDIDATE_LIMIT = 500;

const COLUMNS = `
  e.id,
  e.slug,
  e.title,
  e.category,
  e.description,
  e.location,
  DATE_FORMAT(e.start_at, '%Y-%m-%d %H:%i:%s') AS start_at,
  DATE_FORMAT(e.end_at, '%Y-%m-%d %H:%i:%s') AS end_at,
  e.image_url,
  e.visibility,
  e.ministry_id,
  mi.name AS ministry_name,
  e.repeat_type,
  DATE_FORMAT(e.repeat_until, '%Y-%m-%d') AS repeat_until,
  e.featured,
  e.status,
  e.created_by,
  u.first_name AS creator_first_name,
  u.last_name AS creator_last_name
`;

const FROM = `
  FROM events e
  LEFT JOIN ministries mi ON mi.id = e.ministry_id
  INNER JOIN users u ON u.id = e.created_by
`;

const ENDS_AT = `COALESCE(e.end_at, DATE_ADD(e.start_at, INTERVAL ${DEFAULT_MINUTES} MINUTE))`;

const UPCOMING = `(
  (e.repeat_type = 'weekly' AND (e.repeat_until IS NULL OR e.repeat_until >= DATE(?)))
  OR (e.repeat_type = 'none' AND ${ENDS_AT} >= ?)
)`;

const PAST = `(
  (e.repeat_type = 'weekly' AND e.repeat_until IS NOT NULL AND e.repeat_until < DATE(?))
  OR (e.repeat_type = 'none' AND ${ENDS_AT} < ?)
)`;

const searchClause = (search) => {
  if (!search) return { sql: "", params: [] };

  const term = `%${search}%`;

  return {
    sql: " AND (e.title LIKE ? OR e.location LIKE ? OR e.category LIKE ?)",
    params: [term, term, term],
  };
};

/*
 * Events that are still to come (or ongoing). The service works out
 * the exact next date of weekly events.
 */
const findUpcoming = async ({ clauseSql, clauseParams, nowStr, search }) => {
  const extra = searchClause(search);

  const [rows] = await db.query(
    `
      SELECT ${COLUMNS}
      ${FROM}
      WHERE e.deleted_at IS NULL
        AND ${clauseSql}
        AND ${UPCOMING}${extra.sql}
      ORDER BY e.start_at ASC
      LIMIT ${CANDIDATE_LIMIT}
    `,
    [...clauseParams, nowStr, nowStr, ...extra.params]
  );

  return rows;
};

const findPast = async ({
  clauseSql,
  clauseParams,
  nowStr,
  search,
  limit,
  offset,
}) => {
  const extra = searchClause(search);

  const params = [...clauseParams, nowStr, nowStr, ...extra.params];

  const [countRows] = await db.query(
    `
      SELECT COUNT(*) AS total
      ${FROM}
      WHERE e.deleted_at IS NULL
        AND ${clauseSql}
        AND ${PAST}${extra.sql}
    `,
    params
  );

  const [rows] = await db.query(
    `
      SELECT ${COLUMNS}
      ${FROM}
      WHERE e.deleted_at IS NULL
        AND ${clauseSql}
        AND ${PAST}${extra.sql}
      ORDER BY e.start_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `,
    params
  );

  return { rows, total: Number(countRows[0]?.total || 0) };
};

const findBySlug = async (slug) => {
  const [rows] = await db.execute(
    `
      SELECT ${COLUMNS}
      ${FROM}
      WHERE e.slug = ? AND e.deleted_at IS NULL
      LIMIT 1
    `,
    [slug]
  );

  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `
      SELECT ${COLUMNS}
      ${FROM}
      WHERE e.id = ? AND e.deleted_at IS NULL
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};

const slugExists = async (slug) => {
  const [rows] = await db.execute(
    "SELECT 1 FROM events WHERE slug = ? LIMIT 1",
    [slug]
  );

  return rows.length > 0;
};

const insertEvent = async (data) => {
  const [result] = await db.execute(
    `
      INSERT INTO events (
        slug, title, category, description, location,
        start_at, end_at, image_url, visibility, ministry_id,
        repeat_type, repeat_until, featured, status, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
    `,
    [
      data.slug,
      data.title,
      data.category,
      data.description,
      data.location,
      data.startAt,
      data.endAt,
      data.imageUrl,
      data.visibility,
      data.ministryId,
      data.repeatType,
      data.repeatUntil,
      data.featured ? 1 : 0,
      data.createdBy,
    ]
  );

  return result.insertId;
};

const updateEvent = async (id, data) => {
  await db.execute(
    `
      UPDATE events
      SET title = ?,
          category = ?,
          description = ?,
          location = ?,
          start_at = ?,
          end_at = ?,
          image_url = ?,
          visibility = ?,
          ministry_id = ?,
          repeat_type = ?,
          repeat_until = ?,
          featured = ?
      WHERE id = ? AND deleted_at IS NULL
    `,
    [
      data.title,
      data.category,
      data.description,
      data.location,
      data.startAt,
      data.endAt,
      data.imageUrl,
      data.visibility,
      data.ministryId,
      data.repeatType,
      data.repeatUntil,
      data.featured ? 1 : 0,
      id,
    ]
  );
};

const setStatus = async (id, status) => {
  await db.execute(
    "UPDATE events SET status = ? WHERE id = ? AND deleted_at IS NULL",
    [status, id]
  );
};

const softDelete = async (id) => {
  await db.execute(
    "UPDATE events SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
};

/* The ministries this person belongs to, and the ones they lead. */
const getMinistryAccess = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT mm.ministry_id, mm.assignment_role
      FROM members m
      INNER JOIN ministry_members mm
        ON mm.member_id = m.id AND mm.status = 'Active'
      INNER JOIN ministries mi
        ON mi.id = mm.ministry_id AND mi.status = 'Active'
      WHERE m.user_id = ?
    `,
    [userId]
  );

  return {
    memberMinistryIds: [...new Set(rows.map((row) => row.ministry_id))],
    ledMinistryIds: [
      ...new Set(
        rows
          .filter((row) => row.assignment_role === "Ministry Leader")
          .map((row) => row.ministry_id)
      ),
    ],
  };
};

const getMinistries = async (ids = null) => {
  let sql = "SELECT id, name FROM ministries WHERE status = 'Active'";
  const params = [];

  if (ids) {
    sql += " AND id IN (?)";
    params.push(ids);
  }

  sql += " ORDER BY name";

  const [rows] = await db.query(sql, params);

  return rows;
};

module.exports = {
  findUpcoming,
  findPast,
  findBySlug,
  findById,
  slugExists,
  insertEvent,
  updateEvent,
  setStatus,
  softDelete,
  getMinistryAccess,
  getMinistries,
};