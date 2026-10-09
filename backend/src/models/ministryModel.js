
const db = require("../config/db");

const listMinistries = async ({ search = "", status = "" } = {}) => {
  let query = `
    SELECT
      m.id,
      m.name,
      m.description,
      m.image_url,
      m.status,
      m.created_at,
      m.updated_at,
      (
        SELECT COUNT(*)
        FROM ministry_members mm
        WHERE mm.ministry_id = m.id
          AND mm.status = 'Active'
          AND mm.assignment_role = 'Member'
      ) AS member_count,
      (
        SELECT COUNT(*)
        FROM ministry_members mm
        WHERE mm.ministry_id = m.id
          AND mm.status = 'Active'
          AND mm.assignment_role = 'Ministry Leader'
      ) AS leader_count
    FROM ministries m
    WHERE 1 = 1
  `;
  const params = [];

  if (search) {
    query += " AND (m.name LIKE ? OR m.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    query += " AND m.status = ?";
    params.push(status);
  }

  query += " ORDER BY m.status ASC, m.name ASC";

  const [rows] = await db.execute(query, params);
  return rows;
};

const getMinistryById = async (id) => {
  const [rows] = await db.execute(
    `SELECT
       m.*,
       (SELECT COUNT(*) FROM ministry_members mm
        WHERE mm.ministry_id = m.id
          AND mm.status = 'Active'
          AND mm.assignment_role = 'Member') AS member_count,
       (SELECT COUNT(*) FROM ministry_members mm
        WHERE mm.ministry_id = m.id
          AND mm.status = 'Active'
          AND mm.assignment_role = 'Ministry Leader') AS leader_count
     FROM ministries m
     WHERE m.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const createMinistry = async ({ name, description, imageUrl }) => {
  const [result] = await db.execute(
    `INSERT INTO ministries (name, description, image_url)
     VALUES (?, ?, ?)`,
    [name, description || null, imageUrl || null]
  );

  return getMinistryById(result.insertId);
};

const updateMinistry = async (id, { name, description, imageUrl }) => {
  await db.execute(
    `UPDATE ministries
     SET name = ?, description = ?, image_url = ?
     WHERE id = ?`,
    [name, description || null, imageUrl || null, id]
  );

  return getMinistryById(id);
};

const updateMinistryStatus = async (id, status) => {
  await db.execute(
    "UPDATE ministries SET status = ? WHERE id = ?",
    [status, id]
  );

  return getMinistryById(id);
};

const getMinistryMembers = async (ministryId, role = "") => {
  let query = `
    SELECT
      mm.id AS assignment_id,
      mm.ministry_id,
      mm.member_id,
      mm.assignment_role,
      mm.status AS assignment_status,
      mm.assigned_at,
      mm.ended_at,
      m.member_number,
      m.status AS member_status,
      u.first_name,
      u.middle_name,
      u.last_name,
      u.email,
      u.phone AS user_phone,
      u.profile_image
    FROM ministry_members mm
    INNER JOIN members m ON m.id = mm.member_id
    INNER JOIN users u ON u.id = m.user_id
    WHERE mm.ministry_id = ?
      AND mm.status = 'Active'
  `;
  const params = [ministryId];

  if (role) {
    query += " AND mm.assignment_role = ?";
    params.push(role);
  }

  query += " ORDER BY mm.assignment_role DESC, u.first_name ASC";

  const [rows] = await db.execute(query, params);
  return rows;
};

const getEligibleMember = async (memberId, connection = db) => {
  const [rows] = await connection.execute(
    `SELECT m.id, m.member_number, m.status, u.first_name,
            u.middle_name, u.last_name, u.email, u.is_active
     FROM members m
     INNER JOIN users u ON u.id = m.user_id
     WHERE m.id = ?
     LIMIT 1`,
    [memberId]
  );

  const member = rows[0] || null;

  if (
    !member ||
    member.status !== "Active" ||
    Number(member.is_active) !== 1
  ) {
    return null;
  }

  return member;
};

module.exports = {
  listMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  updateMinistryStatus,
  getMinistryMembers,
  getEligibleMember,
};
