
const db = require("../config/db");

async function getUserAccess(userId, roleId) {
  const [rows] = await db.execute(
    `SELECT
       u.id AS user_id,
       u.role_id,
       u.is_active AS user_active,
       r.name AS role_name,
       r.is_active AS role_active,
       p.name AS permission_name
     FROM users u
     JOIN roles r ON r.id = u.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     WHERE u.id = ? AND u.role_id = ?`,
    [userId, roleId]
  );

  if (
    !rows.length ||
    !rows[0].user_active ||
    !rows[0].role_active
  ) {
    return null;
  }

  return {
    userId: Number(rows[0].user_id),
    roleId: Number(rows[0].role_id),
    roleName: rows[0].role_name,
    permissions: rows
      .map((row) => row.permission_name)
      .filter(Boolean),
  };
}

async function getMembershipOverview() {
  const [rows] = await db.execute(`
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(status = 'Active'), 0) AS active,
      COALESCE(SUM(status = 'Inactive'), 0) AS inactive,
      COALESCE(SUM(DATE(created_at) = CURDATE()), 0) AS newToday
    FROM members
  `);

  const row = rows[0];

  return {
    total: Number(row.total || 0),
    active: Number(row.active || 0),
    inactive: Number(row.inactive || 0),
    newToday: Number(row.newToday || 0),
  };
}

async function getMemberRegistrationHistory() {
  const [rows] = await db.execute(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS registrations
    FROM members
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month
  `);

  let cumulativeRegistrations = 0;

  return rows.map((row) => {
    const registrations = Number(row.registrations || 0);
    cumulativeRegistrations += registrations;

    return {
      month: row.month,
      registrations,
      cumulativeRegistrations,
    };
  });
}

async function getMinistryOverview() {
  const [rows] = await db.execute(`
    SELECT
      mi.id,
      mi.name,
      mi.status,
      COUNT(DISTINCT CASE
        WHEN mm.status = 'Active'
          AND mm.assignment_role = 'Member'
          AND m.status = 'Active'
          AND u.is_active = 1
        THEN mm.member_id
      END) AS member_count,
      COUNT(DISTINCT CASE
        WHEN mm.status = 'Active'
          AND mm.assignment_role = 'Ministry Leader'
          AND m.status = 'Active'
          AND u.is_active = 1
        THEN mm.member_id
      END) AS leader_count
    FROM ministries mi
    LEFT JOIN ministry_members mm
      ON mm.ministry_id = mi.id
    LEFT JOIN members m ON m.id = mm.member_id
    LEFT JOIN users u ON u.id = m.user_id
    GROUP BY mi.id, mi.name, mi.status
    ORDER BY mi.name
  `);

  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    status: row.status,
    memberCount: Number(row.member_count || 0),
    leaderCount: Number(row.leader_count || 0),
  }));
}

async function getMinistryRoster(ministryId) {
  const [rows] = await db.execute(
    `SELECT
       u.first_name,
       u.middle_name,
       u.last_name,
       mm.assignment_role,
       mm.assigned_at
     FROM ministry_members mm
     JOIN ministries mi ON mi.id = mm.ministry_id
     JOIN members m ON m.id = mm.member_id
     JOIN users u ON u.id = m.user_id
     WHERE mm.ministry_id = ?
       AND mi.status = 'Active'
       AND mm.status = 'Active'
       AND m.status = 'Active'
       AND u.is_active = 1
     ORDER BY
       mm.assignment_role DESC,
       u.first_name,
       u.last_name`,
    [ministryId]
  );

  return rows;
}

async function getAssignmentHistory(ministryId) {
  const [rows] = await db.execute(
    `SELECT
       DATE_FORMAT(assigned_at, '%Y-%m') AS month,
       COUNT(*) AS assignmentsStarted
     FROM ministry_members
     WHERE ministry_id = ?
     GROUP BY DATE_FORMAT(assigned_at, '%Y-%m')
     ORDER BY month`,
    [ministryId]
  );

  return rows.map((row) => ({
    month: row.month,
    assignmentsStarted: Number(row.assignmentsStarted || 0),
  }));
}

async function getMemberMinistries(userId) {
  const [rows] = await db.execute(
    `SELECT
       mi.name AS ministry_name,
       mi.status AS ministry_status,
       mm.assignment_role,
       mm.assigned_at
     FROM members m
     JOIN ministry_members mm ON mm.member_id = m.id
     JOIN ministries mi ON mi.id = mm.ministry_id
     WHERE m.user_id = ?
       AND mm.status = 'Active'
       AND m.status = 'Active'
     ORDER BY mi.name`,
    [userId]
  );

  return rows;
}

async function getLeaderMinistries(userId) {
  const [rows] = await db.execute(
    `SELECT DISTINCT
       mi.id,
       mi.name,
       mi.status
     FROM members m
     JOIN ministry_members mm ON mm.member_id = m.id
     JOIN ministries mi ON mi.id = mm.ministry_id
     WHERE m.user_id = ?
       AND m.status = 'Active'
       AND mm.status = 'Active'
       AND mm.assignment_role = 'Ministry Leader'
     ORDER BY mi.name`,
    [userId]
  );

  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    status: row.status,
  }));
}

async function getOwnMemberRecord(userId) {
  const [rows] = await db.execute(
    `SELECT
       u.first_name,
       u.middle_name,
       u.last_name,
       m.gender,
       m.status AS membership_status,
       m.date_of_birth,
       m.baptism_date,
       m.created_at
     FROM users u
     JOIN members m ON m.user_id = u.id
     WHERE u.id = ?
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

async function getRolePermissionOverview() {
  const [rows] = await db.execute(`
    SELECT
      r.id AS role_id,
      r.name AS role_name,
      r.is_active AS role_active,
      p.name AS permission_name,
      p.description AS permission_description
    FROM roles r
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    LEFT JOIN permissions p ON p.id = rp.permission_id
    ORDER BY r.name, p.name
  `);

  const roleMap = new Map();

  for (const row of rows) {
    if (!roleMap.has(row.role_id)) {
      roleMap.set(row.role_id, {
        id: Number(row.role_id),
        name: row.role_name,
        active: Boolean(row.role_active),
        permissions: [],
      });
    }

    if (row.permission_name) {
      roleMap.get(row.role_id).permissions.push({
        name: row.permission_name,
        description: row.permission_description,
      });
    }
  }

  return [...roleMap.values()];
}

module.exports = {
  getUserAccess,
  getMembershipOverview,
  getMemberRegistrationHistory,
  getMinistryOverview,
  getMinistryRoster,
  getAssignmentHistory,
  getMemberMinistries,
  getLeaderMinistries,
  getOwnMemberRecord,
  getRolePermissionOverview,
};
