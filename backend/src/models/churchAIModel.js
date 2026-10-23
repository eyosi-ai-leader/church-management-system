
const db = require("../config/db");

const columnCache = new Map();

async function getColumns(tableName) {
  if (columnCache.has(tableName)) {
    return columnCache.get(tableName);
  }

  const allowedTables = new Set([
    "users",
    "members",
    "ministries",
    "ministry_members",
  ]);

  if (!allowedTables.has(tableName)) {
    throw new Error("Unsupported table name.");
  }

  const [rows] = await db.execute(
    `SHOW COLUMNS FROM \`${tableName}\``
  );

  const columns = new Set(rows.map((row) => row.Field));
  columnCache.set(tableName, columns);

  return columns;
}

function optionalColumn(columns, columnName, alias, tableAlias) {
  if (!columns.has(columnName)) {
    return `NULL AS \`${alias}\``;
  }

  return `${tableAlias}.\`${columnName}\` AS \`${alias}\``;
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < dob.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 && age <= 125 ? age : null;
}

function shapePerson(row) {
  const fullName = [
    row.first_name,
    row.middle_name,
    row.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ministryId:
      row.ministry_id == null
        ? null
        : Number(row.ministry_id),

    ministryName: row.ministry_name || null,

    firstName: row.first_name || null,
    middleName: row.middle_name || null,
    lastName: row.last_name || null,
    fullName: fullName || null,

    email: row.email || null,
    phone: row.phone || null,
    age: calculateAge(row.date_of_birth),

    membershipStatus: row.membership_status || null,
    memberSince: row.member_since || null,
    memberUpdatedAt: row.member_updated_at || null,

    // Preserve the real assignment role from the database.
    assignmentRole:
      row.assignment_role || "Ministry Member",

    assignedAt: row.assigned_at || null,
  };
}

/**
 * Read the authenticated user's current role and permissions.
 */
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
     JOIN roles r
       ON r.id = u.role_id
     LEFT JOIN role_permissions rp
       ON rp.role_id = r.id
     LEFT JOIN permissions p
       ON p.id = rp.permission_id
     WHERE u.id = ?
       AND u.role_id = ?`,
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

    permissions: [
      ...new Set(
        rows
          .map((row) => row.permission_name)
          .filter(Boolean)
      ),
    ],
  };
}

/**
 * Organization-wide member counts.
 */
async function getMembershipOverview() {
  const [rows] = await db.execute(`
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(status = 'Active'), 0) AS active,
      COALESCE(SUM(status = 'Inactive'), 0) AS inactive,
      COALESCE(
        SUM(DATE(created_at) = CURDATE()),
        0
      ) AS newToday
    FROM members
  `);

  const row = rows[0] || {};

  return {
    total: Number(row.total || 0),
    active: Number(row.active || 0),
    inactive: Number(row.inactive || 0),
    newToday: Number(row.newToday || 0),
  };
}

/**
 * Monthly registrations and cumulative registrations.
 */
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

/**
 * Ministry details and counts of active members and leaders.
 */
async function getMinistryOverview() {
  const ministryColumns = await getColumns("ministries");

  const descriptionSelect = optionalColumn(
    ministryColumns,
    "description",
    "description",
    "mi"
  );

  const createdSelect = optionalColumn(
    ministryColumns,
    "created_at",
    "created_at",
    "mi"
  );

  const updatedSelect = optionalColumn(
    ministryColumns,
    "updated_at",
    "updated_at",
    "mi"
  );

  const groupByColumns = [
    "mi.id",
    "mi.name",
    "mi.status",
  ];

  if (ministryColumns.has("description")) {
    groupByColumns.push("mi.description");
  }

  if (ministryColumns.has("created_at")) {
    groupByColumns.push("mi.created_at");
  }

  if (ministryColumns.has("updated_at")) {
    groupByColumns.push("mi.updated_at");
  }

  const [rows] = await db.execute(`
    SELECT
      mi.id,
      mi.name,
      mi.status,
      ${descriptionSelect},
      ${createdSelect},
      ${updatedSelect},

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

    LEFT JOIN members m
      ON m.id = mm.member_id

    LEFT JOIN users u
      ON u.id = m.user_id

    GROUP BY ${groupByColumns.join(", ")}

    ORDER BY mi.name
  `);

  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    description: row.description || null,
    status: row.status,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    memberCount: Number(row.member_count || 0),
    leaderCount: Number(row.leader_count || 0),
  }));
}

/**
 * Build profile fields from columns that exist.
 *
 * Does not select passwords, tokens, identity numbers,
 * or return the full date of birth to the AI.
 */
async function personSelectFields() {
  const userColumns = await getColumns("users");
  const memberColumns = await getColumns("members");
  const assignmentColumns = await getColumns(
    "ministry_members"
  );

  return [
    optionalColumn(
      userColumns,
      "first_name",
      "first_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "middle_name",
      "middle_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "last_name",
      "last_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "email",
      "email",
      "u"
    ),
    optionalColumn(
      userColumns,
      "phone",
      "phone",
      "u"
    ),
    optionalColumn(
      memberColumns,
      "date_of_birth",
      "date_of_birth",
      "m"
    ),
    optionalColumn(
      memberColumns,
      "status",
      "membership_status",
      "m"
    ),
    optionalColumn(
      memberColumns,
      "created_at",
      "member_since",
      "m"
    ),
    optionalColumn(
      memberColumns,
      "updated_at",
      "member_updated_at",
      "m"
    ),
    optionalColumn(
      assignmentColumns,
      "assignment_role",
      "assignment_role",
      "mm"
    ),
    optionalColumn(
      assignmentColumns,
      "assigned_at",
      "assigned_at",
      "mm"
    ),
  ].join(",\n");
}

/**
 * Get active leaders for one active ministry.
 */
async function getMinistryLeaders(ministryId) {
  const fields = await personSelectFields();

  const [rows] = await db.execute(
    `SELECT
       mi.id AS ministry_id,
       mi.name AS ministry_name,
       ${fields}
     FROM ministry_members mm

     JOIN ministries mi
       ON mi.id = mm.ministry_id

     JOIN members m
       ON m.id = mm.member_id

     JOIN users u
       ON u.id = m.user_id

     WHERE mm.ministry_id = ?
       AND mi.status = 'Active'
       AND mm.status = 'Active'
       AND mm.assignment_role = 'Ministry Leader'
       AND m.status = 'Active'
       AND u.is_active = 1

     ORDER BY u.first_name, u.last_name`,
    [ministryId]
  );

  return rows.map(shapePerson);
}

/**
 * Get all active ministry members and leaders with the
 * same profile fields.
 *
 * Each record includes the person's actual assignment role,
 * membership status, member-since date, and assignment date.
 */
async function getMinistryRoster(ministryId) {
  const fields = await personSelectFields();

  const [rows] = await db.execute(
    `SELECT
       mi.id AS ministry_id,
       mi.name AS ministry_name,
       ${fields}
     FROM ministry_members mm

     JOIN ministries mi
       ON mi.id = mm.ministry_id

     JOIN members m
       ON m.id = mm.member_id

     JOIN users u
       ON u.id = m.user_id

     WHERE mm.ministry_id = ?
       AND mi.status = 'Active'
       AND mm.status = 'Active'
       AND m.status = 'Active'
       AND u.is_active = 1

     ORDER BY
       CASE
         WHEN mm.assignment_role = 'Ministry Leader'
         THEN 0
         ELSE 1
       END,
       u.first_name,
       u.last_name`,
    [ministryId]
  );

  return rows.map(shapePerson);
}

/**
 * Monthly assignment starts for one ministry.
 */
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
    assignmentsStarted: Number(
      row.assignmentsStarted || 0
    ),
  }));
}

/**
 * Ministry assignments for the authenticated user's own record.
 */
async function getMemberMinistries(userId) {
  const [rows] = await db.execute(
    `SELECT
       mi.name AS ministry_name,
       mi.status AS ministry_status,
       mm.assignment_role,
       mm.assigned_at
     FROM members m

     JOIN ministry_members mm
       ON mm.member_id = m.id

     JOIN ministries mi
       ON mi.id = mm.ministry_id

     JOIN users u
       ON u.id = m.user_id

     WHERE m.user_id = ?
       AND mm.status = 'Active'
       AND m.status = 'Active'
       AND u.is_active = 1

     ORDER BY mi.name`,
    [userId]
  );

  return rows;
}

/**
 * Return only active ministries assigned to a leader.
 */
async function getLeaderMinistries(userId) {
  const [rows] = await db.execute(
    `SELECT DISTINCT
       mi.id,
       mi.name,
       mi.status
     FROM members m

     JOIN users u
       ON u.id = m.user_id

     JOIN ministry_members mm
       ON mm.member_id = m.id

     JOIN ministries mi
       ON mi.id = mm.ministry_id

     WHERE m.user_id = ?
       AND u.is_active = 1
       AND m.status = 'Active'
       AND mm.status = 'Active'
       AND mm.assignment_role = 'Ministry Leader'
       AND mi.status = 'Active'

     ORDER BY mi.name`,
    [userId]
  );

  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    status: row.status,
  }));
}

/**
 * Limited profile for the authenticated user.
 */
async function getOwnMemberRecord(userId) {
  const userColumns = await getColumns("users");
  const memberColumns = await getColumns("members");

  const fields = [
    optionalColumn(
      userColumns,
      "first_name",
      "first_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "middle_name",
      "middle_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "last_name",
      "last_name",
      "u"
    ),
    optionalColumn(
      userColumns,
      "email",
      "email",
      "u"
    ),
    optionalColumn(
      userColumns,
      "phone",
      "phone",
      "u"
    ),
    optionalColumn(
      memberColumns,
      "date_of_birth",
      "date_of_birth",
      "m"
    ),
    optionalColumn(
      memberColumns,
      "status",
      "membership_status",
      "m"
    ),
    optionalColumn(
      memberColumns,
      "created_at",
      "member_since",
      "m"
    ),
  ].join(",\n");

  const [rows] = await db.execute(
    `SELECT ${fields}
     FROM users u

     JOIN members m
       ON m.user_id = u.id

     WHERE u.id = ?
     LIMIT 1`,
    [userId]
  );

  if (!rows.length) {
    return null;
  }

  const row = rows[0];

  return {
    firstName: row.first_name || null,
    middleName: row.middle_name || null,
    lastName: row.last_name || null,

    fullName: [
      row.first_name,
      row.middle_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ") || null,

    email: row.email || null,
    phone: row.phone || null,
    age: calculateAge(row.date_of_birth),
    membershipStatus: row.membership_status || null,
    memberSince: row.member_since || null,
  };
}

/**
 * Role and permission overview for authorized users.
 */
async function getRolePermissionOverview() {
  const [rows] = await db.execute(`
    SELECT
      r.id AS role_id,
      r.name AS role_name,
      r.is_active AS role_active,
      p.name AS permission_name,
      p.description AS permission_description

    FROM roles r

    LEFT JOIN role_permissions rp
      ON rp.role_id = r.id

    LEFT JOIN permissions p
      ON p.id = rp.permission_id

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
  getMinistryLeaders,
  getMinistryRoster,
  getAssignmentHistory,
  getMemberMinistries,
  getLeaderMinistries,
  getOwnMemberRecord,
  getRolePermissionOverview,
};
