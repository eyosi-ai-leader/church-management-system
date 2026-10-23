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
      LIMIT 3
    `);

    // ------------------------------------------
    // Member Growth - Last 8 Months
    // ------------------------------------------
    const [growthRows] = await db.query(`
      SELECT
        DATE_FORMAT(months.month_date, '%b') AS month,
        (
          SELECT COUNT(*)
          FROM members m
          WHERE m.created_at < DATE_ADD(
            months.month_date,
            INTERVAL 1 MONTH
          )
        ) AS value
      FROM (
        SELECT
          DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL 7 MONTH),
            '%Y-%m-01'
          ) + INTERVAL seq.month_offset MONTH AS month_date
        FROM (
          SELECT 0 AS month_offset
          UNION ALL SELECT 1
          UNION ALL SELECT 2
          UNION ALL SELECT 3
          UNION ALL SELECT 4
          UNION ALL SELECT 5
          UNION ALL SELECT 6
          UNION ALL SELECT 7
        ) AS seq
      ) AS months
      ORDER BY months.month_date ASC
    `);

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

      memberGrowth: growthRows.map((item) => ({
        month: item.month,
        value: Number(item.value || 0),
      })),
    };
  }

  // ==========================================
  // PASTOR DASHBOARD
  // roleId = 2
  // ==========================================
  if (user.roleId === 2) {
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

    const [recentMembers] = await db.query(`
      SELECT
        m.id,
        u.first_name,
        u.last_name,
        u.email,
        m.status,
        m.created_at AS createdAt
      FROM members m
      INNER JOIN users u
        ON u.id = m.user_id
      ORDER BY m.created_at DESC
      LIMIT 3
    `);

    const [growthRows] = await db.query(`
      SELECT
        DATE_FORMAT(months.month_date, '%b') AS month,
        (
          SELECT COUNT(*)
          FROM members m
          WHERE m.created_at < DATE_ADD(
            months.month_date,
            INTERVAL 1 MONTH
          )
        ) AS value
      FROM (
        SELECT
          DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL 7 MONTH),
            '%Y-%m-01'
          ) + INTERVAL seq.month_offset MONTH AS month_date
        FROM (
          SELECT 0 AS month_offset
          UNION ALL SELECT 1
          UNION ALL SELECT 2
          UNION ALL SELECT 3
          UNION ALL SELECT 4
          UNION ALL SELECT 5
          UNION ALL SELECT 6
          UNION ALL SELECT 7
        ) AS seq
      ) AS months
      ORDER BY months.month_date ASC
    `);

    return {
      role: "Pastor",

      members: {
        total: Number(memberStats[0].totalMembers || 0),
        active: Number(memberStats[0].activeMembers || 0),
        inactive: Number(memberStats[0].inactiveMembers || 0),
        newToday: Number(memberStats[0].newMembersToday || 0),
      },

      recentActivity: recentMembers.map((member) => ({
        id: member.id,
        title: "Church member",
        description: `${member.first_name} ${member.last_name}`,
        email: member.email,
        status: member.status,
        createdAt: member.createdAt,
      })),

      memberGrowth: growthRows.map((item) => ({
        month: item.month,
        value: Number(item.value || 0),
      })),
    };
  }

  // ==========================================
  // CHURCH ELDER DASHBOARD
  // roleId = 3
  // ==========================================
  if (user.roleId === 3) {
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
    // Recent Members
    // ------------------------------------------
    const [recentMembers] = await db.query(`
      SELECT
        m.id,
        u.first_name,
        u.last_name,
        u.email,
        m.status,
        m.created_at AS createdAt
      FROM members m
      INNER JOIN users u
        ON u.id = m.user_id
      ORDER BY m.created_at DESC
      LIMIT 3
    `);

    // ------------------------------------------
    // Member Growth - Last 8 Months
    // ------------------------------------------
    const [growthRows] = await db.query(`
      SELECT
        DATE_FORMAT(months.month_date, '%b') AS month,
        (
          SELECT COUNT(*)
          FROM members m
          WHERE m.created_at < DATE_ADD(
            months.month_date,
            INTERVAL 1 MONTH
          )
        ) AS value
      FROM (
        SELECT
          DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL 7 MONTH),
            '%Y-%m-01'
          ) + INTERVAL seq.month_offset MONTH AS month_date
        FROM (
          SELECT 0 AS month_offset
          UNION ALL SELECT 1
          UNION ALL SELECT 2
          UNION ALL SELECT 3
          UNION ALL SELECT 4
          UNION ALL SELECT 5
          UNION ALL SELECT 6
          UNION ALL SELECT 7
        ) AS seq
      ) AS months
      ORDER BY months.month_date ASC
    `);

    return {
      role: "Church Elder",

      members: {
        total: Number(memberStats[0].totalMembers || 0),
        active: Number(memberStats[0].activeMembers || 0),
        inactive: Number(memberStats[0].inactiveMembers || 0),
        newToday: Number(memberStats[0].newMembersToday || 0),
      },

      recentActivity: recentMembers.map((member) => ({
        id: member.id,
        title: "Church member",
        description: `${member.first_name} ${member.last_name}`,
        email: member.email,
        status: member.status,
        createdAt: member.createdAt,
      })),

      memberGrowth: growthRows.map((item) => ({
        month: item.month,
        value: Number(item.value || 0),
      })),
    };
  }


  
  // ==========================================
  // MINISTRY LEADER DASHBOARD
  // roleId = 4
  // ==========================================
  if (Number(user.roleId) === 4) {
    // Find only ministries assigned to the authenticated leader.
    const [ministryRows] = await db.query(
      `
        SELECT DISTINCT
          mi.id,
          mi.name,
          mi.description,
          mi.status
        FROM members m
        INNER JOIN ministry_members mm
          ON mm.member_id = m.id
        INNER JOIN ministries mi
          ON mi.id = mm.ministry_id
        INNER JOIN users u
          ON u.id = m.user_id
        WHERE m.user_id = ?
          AND m.status = 'Active'
          AND u.is_active = 1
          AND mm.assignment_role = 'Ministry Leader'
          AND mm.status = 'Active'
          AND mi.status = 'Active'
        ORDER BY mi.name ASC
      `,
      [user.id]
    );

    // A leader may have no active ministry assignments.
    if (ministryRows.length === 0) {
      return {
        role: "Ministry Leader",
        ministries: [],
        summary: {
          totalMinistries: 0,
          totalMembers: 0,
        },
        message: "You do not currently have an active ministry assignment.",
      };
    }

    const ministries = [];

    // Fetch the active roster for each ministry the leader manages.
    for (const ministry of ministryRows) {
      const [memberRows] = await db.query(
        `
          SELECT
            m.id AS memberId,
            u.id AS userId,
            m.member_number AS memberNumber,
            u.first_name AS firstName,
            u.middle_name AS middleName,
            u.last_name AS lastName,
            u.email,
            COALESCE(m.phone, u.phone) AS phone,
            u.profile_image AS profileImage,
            m.status AS memberStatus,
            m.created_at AS memberSince,
            m.updated_at AS updatedAt,
            CASE
              WHEN m.date_of_birth IS NOT NULL
              THEN TIMESTAMPDIFF(
                YEAR,
                m.date_of_birth,
                CURDATE()
              )
              ELSE NULL
            END AS age,
            mm.assignment_role AS assignmentRole,
            mm.assigned_at AS assignedAt
          FROM ministry_members mm
          INNER JOIN members m
            ON m.id = mm.member_id
          INNER JOIN users u
            ON u.id = m.user_id
          WHERE mm.ministry_id = ?
            AND mm.status = 'Active'
            AND m.status = 'Active'
            AND u.is_active = 1
          ORDER BY u.first_name ASC, u.last_name ASC
        `,
        [ministry.id]
      );

      const members = memberRows.map((member) => ({
        id: member.memberId,
        userId: member.userId,
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        middleName: member.middleName,
        lastName: member.lastName,
        fullName: [
          member.firstName,
          member.middleName,
          member.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        email: member.email,
        phone: member.phone,
        profileImage: member.profileImage,
        age:
          member.age === null || member.age === undefined
            ? null
            : Number(member.age),
        status: member.memberStatus,
        memberSince: member.memberSince,
        updatedAt: member.updatedAt,
        assignmentRole: member.assignmentRole,
        assignedAt: member.assignedAt,
      }));

      ministries.push({
        id: ministry.id,
        name: ministry.name,
        description: ministry.description,
        status: ministry.status,
        memberCount: members.length,
        members,
      });
    }

    return {
      role: "Ministry Leader",
      ministries,
      summary: {
        totalMinistries: ministries.length,
        totalMembers: ministries.reduce(
          (total, ministry) => total + ministry.memberCount,
          0
        ),
      },
    };
  }


  // ==========================================
// MEMBER DASHBOARD
// roleId = 5
// ==========================================
if (user.roleId === 5) {

  // ------------------------------------------
  // Get the authenticated member
  // ------------------------------------------
  const [memberRows] = await db.query(
    `
      SELECT
        m.id,
        m.user_id,
        m.member_number,

        u.first_name,
        u.middle_name,
        u.last_name,
        u.email,
        u.role_id,

        r.name AS role_name,

        u.phone AS user_phone,
        u.profile_image,

        m.gender,
        m.phone,
        m.date_of_birth,
        m.baptism_date,
        m.address,
        m.status,

        m.created_at,
        m.updated_at

      FROM members m

      INNER JOIN users u
        ON m.user_id = u.id

      LEFT JOIN roles r
        ON u.role_id = r.id

      WHERE m.user_id = ?

      LIMIT 1
    `,
    [user.id]
  );

  const member = memberRows[0];

  console.log("Member dashboard record:", member);

  // ------------------------------------------
  // Member record not found
  // ------------------------------------------
  if (!member) {
    return {
      role: "Member",
      member: null,
      message: "Member profile not found.",
    };
  }

  return {
    role: "Member",

    member: {
      id: member.id,
      userId: member.user_id,

      memberNumber: member.member_number,

      firstName: member.first_name,
      middleName: member.middle_name,
      lastName: member.last_name,

      email: member.email,

      roleId: member.role_id,
      roleName: member.role_name,

      phone: member.phone || member.user_phone || null,

      profileImage: member.profile_image,

      gender: member.gender,
      dateOfBirth: member.date_of_birth,
      baptismDate: member.baptism_date,

      address: member.address,

      status: member.status,

      memberSince: member.created_at,
      updatedAt: member.updated_at,
    },
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