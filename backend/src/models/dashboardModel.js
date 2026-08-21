const db = require("../config/db");

async function getDashboardOverview(user) {
  console.log("Dashboard user:", user);

  // ==========================================
  // ADMIN DASHBOARD
  // roleId = 1
  // ==========================================
  if (user.roleId === 1) {
    // ------------------------------------------
    // Member Statistics
    // ------------------------------------------
    const [memberStats] = await db.query(`
      SELECT
        COUNT(*) AS totalMembers,

        SUM(
          CASE
            WHEN status = 'Active' THEN 1
            ELSE 0
          END
        ) AS activeMembers,

        SUM(
          CASE
            WHEN status = 'Inactive' THEN 1
            ELSE 0
          END
        ) AS inactiveMembers,

        SUM(
          CASE
            WHEN DATE(created_at) = CURDATE() THEN 1
            ELSE 0
          END
        ) AS newMembersToday

      FROM members
    `);

    // ------------------------------------------
    // Role Distribution
    // ------------------------------------------
    const [roleStats] = await db.query(`
      SELECT
        r.id AS roleId,
        r.name AS roleName,
        COUNT(u.id) AS total
      FROM roles r
      LEFT JOIN users u
        ON u.role_id = r.id
      GROUP BY r.id, r.name
      ORDER BY r.id ASC
    `);

    // ------------------------------------------
    // Recent Registered Users
    // ------------------------------------------
    const [recentActivity] = await db.query(`
      SELECT
        u.id,
        'New member registered' AS title,
        CONCAT(u.first_name, ' ', u.last_name) AS description,
        u.created_at AS createdAt
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 5
    `);

    // ------------------------------------------
    // Return Dashboard
    // ------------------------------------------
    return {
      role: "Admin",

      members: {
        total: Number(memberStats[0].totalMembers || 0),
        active: Number(memberStats[0].activeMembers || 0),
        inactive: Number(memberStats[0].inactiveMembers || 0),
        newToday: Number(memberStats[0].newMembersToday || 0),
      },

      roles: roleStats.map((role) => ({
        roleId: role.roleId,
        roleName: role.roleName,
        total: Number(role.total || 0),
      })),

      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        createdAt: activity.createdAt,
      })),
    };
  }

  // ==========================================
  // OTHER ROLES
  // ==========================================
  return {
    roleId: user.roleId,
    message: "Dashboard data for this role is coming soon.",
  };
}

module.exports = {
  getDashboardOverview,
};