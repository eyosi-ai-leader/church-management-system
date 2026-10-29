const db = require("../config/db");

const getProfileByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT
        u.id AS user_id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.email,
        u.phone AS user_phone,
        u.profile_image,
        u.role_id,
        u.created_at AS user_created_at,
        r.name AS role_name,

        m.id AS member_id,
        m.member_number,
        m.gender,
        m.phone AS member_phone,
        DATE_FORMAT(m.date_of_birth, '%Y-%m-%d') AS date_of_birth,
        DATE_FORMAT(m.baptism_date, '%Y-%m-%d') AS baptism_date,
        m.address,
        m.status

      FROM users u
      LEFT JOIN members m ON m.user_id = u.id
      LEFT JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

module.exports = {
  getProfileByUserId,
};