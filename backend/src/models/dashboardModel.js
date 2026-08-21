const db = require("../config/db");

async function getDashboardOverview() {
  const [rows] = await db.query(`
    SELECT
      COUNT(*) AS totalMembers,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS activeMembers,
      SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS inactiveMembers,
      SUM(
        CASE
          WHEN DATE(created_at) = CURDATE() THEN 1
          ELSE 0
        END
      ) AS newMembersToday
    FROM members
  `);

  return rows[0];
}

module.exports = {
  getDashboardOverview,
};