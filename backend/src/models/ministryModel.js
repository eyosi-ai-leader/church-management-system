
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
       (SELECT COUNT(*)
        FROM ministry_members mm
        WHERE mm.ministry_id = m.id
          AND mm.status = 'Active'
          AND mm.assignment_role = 'Member') AS member_count,
       (SELECT COUNT(*)
        FROM ministry_members mm
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

// Ministry Leaders can edit only their ministry's name and description.
const updateLeaderMinistry = async (id, { name, description }) => {
  await db.execute(
    `UPDATE ministries
     SET name = ?, description = ?
     WHERE id = ?`,
    [name, description || null, id]
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

// Check that the authenticated user currently leads this active ministry.
const isLeaderOfMinistry = async (userId, ministryId) => {
  const [rows] = await db.execute(
    `SELECT 1
     FROM ministry_members leader_assignment
     INNER JOIN members leader_member
       ON leader_member.id = leader_assignment.member_id
     INNER JOIN users leader_user
       ON leader_user.id = leader_member.user_id
     INNER JOIN ministries mi
       ON mi.id = leader_assignment.ministry_id
     WHERE leader_user.id = ?
       AND mi.id = ?
       AND mi.status = 'Active'
       AND leader_assignment.assignment_role = 'Ministry Leader'
       AND leader_assignment.status = 'Active'
       AND leader_member.status = 'Active'
       AND leader_user.is_active = 1
     LIMIT 1`,
    [userId, ministryId]
  );

  return rows.length > 0;
};

const getMinistryMembers = async (
  ministryId,
  role = "",
  status = "Active"
) => {
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
      m.gender,
      m.date_of_birth,
      m.baptism_date,
      m.address,
      m.phone AS member_phone,
      m.status AS member_status,
      CASE
        WHEN m.date_of_birth IS NOT NULL
        THEN TIMESTAMPDIFF(YEAR, m.date_of_birth, CURDATE())
        ELSE NULL
      END AS age,
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
  `;

  const params = [ministryId];

  if (status && status !== "All") {
    query += " AND mm.status = ?";
    params.push(status);
  }

  if (role) {
    query += " AND mm.assignment_role = ?";
    params.push(role);
  }

  query += " ORDER BY mm.assignment_role DESC, u.first_name ASC";

  const [rows] = await db.execute(query, params);
  return rows;
};

// Fetch the latest assignment record for a particular member/ministry pair.
const getMinistryAssignment = async (ministryId, memberId) => {
  const [rows] = await db.execute(
    `SELECT id, ministry_id, member_id, assignment_role, status
     FROM ministry_members
     WHERE ministry_id = ? AND member_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    [ministryId, memberId]
  );

  return rows[0] || null;
};

const getEligibleMember = async (memberId, connection = db) => {
  const [rows] = await connection.execute(
    `SELECT
       m.id,
       m.member_number,
       m.status,
       u.first_name,
       u.middle_name,
       u.last_name,
       u.email,
       u.is_active
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

const getLeaderMinistries = async (userId) => {
  const [ministries] = await db.execute(
    `SELECT DISTINCT
       mi.id,
       mi.name,
       mi.description,
       mi.image_url,
       mi.status
     FROM ministries mi
     INNER JOIN ministry_members leader_assignment
       ON leader_assignment.ministry_id = mi.id
     INNER JOIN members leader_member
       ON leader_member.id = leader_assignment.member_id
     INNER JOIN users leader_user
       ON leader_user.id = leader_member.user_id
     WHERE leader_user.id = ?
       AND leader_assignment.assignment_role = 'Ministry Leader'
       AND leader_assignment.status = 'Active'
       AND leader_member.status = 'Active'
       AND leader_user.is_active = 1
       AND mi.status = 'Active'
     ORDER BY mi.name ASC`,
    [userId]
  );

  if (ministries.length === 0) {
    return [];
  }

  const ministryIds = ministries.map((ministry) => ministry.id);
  const placeholders = ministryIds.map(() => "?").join(", ");

  const [members] = await db.execute(
    `SELECT
       mm.ministry_id,
       mm.member_id,
       mm.assignment_role,
       mm.status AS assignment_status,
       mm.assigned_at,
       mm.ended_at,
       m.member_number,
       m.gender,
       m.date_of_birth,
       m.baptism_date,
       m.address,
       m.phone AS member_phone,
       m.status AS member_status,
       CASE
         WHEN m.date_of_birth IS NOT NULL
         THEN TIMESTAMPDIFF(YEAR, m.date_of_birth, CURDATE())
         ELSE NULL
       END AS age,
       u.first_name,
       u.middle_name,
       u.last_name,
       u.email,
       u.phone,
       u.profile_image
     FROM ministry_members mm
     INNER JOIN members m ON m.id = mm.member_id
     INNER JOIN users u ON u.id = m.user_id
     WHERE mm.ministry_id IN (${placeholders})
       AND mm.status = 'Active'
       AND m.status = 'Active'
       AND u.is_active = 1
     ORDER BY u.first_name ASC, u.last_name ASC`,
    ministryIds
  );

  return ministries.map((ministry) => {
    const ministryMembers = members.filter(
      (member) => member.ministry_id === ministry.id
    );

    return {
      ...ministry,
      members: ministryMembers,
      memberCount: ministryMembers.filter(
        (member) => member.assignment_role === "Member"
      ).length,
      leaderCount: ministryMembers.filter(
        (member) => member.assignment_role === "Ministry Leader"
      ).length,
    };
  });
};

module.exports = {
  listMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  updateLeaderMinistry,
  updateMinistryStatus,
  isLeaderOfMinistry,
  getMinistryMembers,
  getMinistryAssignment,
  getEligibleMember,
  getLeaderMinistries,
};
