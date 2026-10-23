
const db = require("../config/db");

const MEMBER_SELECT = `
  SELECT
    m.id,
    m.user_id,
    mm.ministry_id,
    mi.name AS ministry_name,
    mm.assignment_role,
    mm.status AS ministry_assignment_status,
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
  FROM ministry_members mm
  INNER JOIN ministries mi
    ON mi.id = mm.ministry_id
  INNER JOIN members m
    ON m.id = mm.member_id
  INNER JOIN users u
    ON u.id = m.user_id
  LEFT JOIN roles r
    ON r.id = u.role_id
  WHERE mm.status = 'Active'
    AND mi.status = 'Active'
    AND u.is_active = 1
    AND EXISTS (
      SELECT 1
      FROM ministry_members leader_assignment
      INNER JOIN ministries leader_ministry
        ON leader_ministry.id = leader_assignment.ministry_id
      INNER JOIN members leader_member
        ON leader_member.id = leader_assignment.member_id
      INNER JOIN users leader_user
        ON leader_user.id = leader_member.user_id
      WHERE leader_assignment.ministry_id = mm.ministry_id
        AND leader_assignment.assignment_role = 'Ministry Leader'
        AND leader_assignment.status = 'Active'
        AND leader_member.status = 'Active'
        AND leader_user.is_active = 1
        AND leader_user.id = ?
        AND leader_ministry.status = 'Active'
    )
`;

const ALLOWED_SORT_FIELDS = {
  first_name: "u.first_name",
  last_name: "u.last_name",
  member_number: "m.member_number",
  email: "u.email",
  created_at: "m.created_at",
};

function buildFilters({
  search = "",
  status = "Active",
  roleId = "",
  ministryId = "",
} = {}) {
  const conditions = [];
  const params = [];

  if (ministryId !== "" && ministryId !== null && ministryId !== undefined) {
    conditions.push("mm.ministry_id = ?");
    params.push(Number(ministryId));
  }

  if (search) {
    conditions.push(`(
      u.first_name LIKE ?
      OR u.middle_name LIKE ?
      OR u.last_name LIKE ?
      OR u.email LIKE ?
      OR m.member_number LIKE ?
      OR m.phone LIKE ?
      OR u.phone LIKE ?
      OR mi.name LIKE ?
    )`);

    const term = `%${search}%`;
    params.push(term, term, term, term, term, term, term, term);
  }

  if (status) {
    conditions.push("m.status = ?");
    params.push(status);
  }

  if (roleId !== "" && roleId !== null && roleId !== undefined) {
    conditions.push("u.role_id = ?");
    params.push(Number(roleId));
  }

  return {
    sql: conditions.length
      ? ` AND ${conditions.join(" AND ")}`
      : "",
    params,
  };
}

async function getLeaderMembers(userId, options = {}) {
 const {
  limit = 10,
  offset = 0,
  search = "",
  status = "Active",
  roleId = "",
  ministryId = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = options;

  const safeLimit = Number.parseInt(limit, 10);
  const safeOffset = Number.parseInt(offset, 10);

  if (
    !Number.isSafeInteger(safeLimit) ||
    safeLimit < 1 ||
    !Number.isSafeInteger(safeOffset) ||
    safeOffset < 0
  ) {
    const error = new Error("Invalid pagination parameters.");
    error.statusCode = 400;
    throw error;
  }

  const sortColumn =
    ALLOWED_SORT_FIELDS[sortBy] || ALLOWED_SORT_FIELDS.created_at;

  const sortDirection =
    String(sortOrder).toLowerCase() === "asc" ? "ASC" : "DESC";

  const filters = buildFilters({
  search,
  status,
  roleId,
  ministryId,
});

  const listQuery = `
    ${MEMBER_SELECT}
    ${filters.sql}
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT ${safeLimit} OFFSET ${safeOffset}
  `;

  const countQuery = `
   SELECT COUNT(*) AS total
    FROM ministry_members mm
    INNER JOIN members m
      ON m.id = mm.member_id
    INNER JOIN users u
      ON u.id = m.user_id

      INNER JOIN ministries mi
  ON mi.id = mm.ministry_id
    WHERE mm.status = 'Active'
    AND mi.status = 'Active'
      AND u.is_active = 1
      AND EXISTS (
        SELECT 1
        FROM ministry_members leader_assignment
        INNER JOIN ministries mi
          ON mi.id = leader_assignment.ministry_id
        INNER JOIN members leader_member
          ON leader_member.id = leader_assignment.member_id
        INNER JOIN users leader_user
          ON leader_user.id = leader_member.user_id
        WHERE leader_assignment.ministry_id = mm.ministry_id
          AND leader_assignment.assignment_role = 'Ministry Leader'
          AND leader_assignment.status = 'Active'
          AND leader_member.status = 'Active'
          AND leader_user.is_active = 1
          AND leader_user.id = ?
          AND mi.status = 'Active'
      )
      ${filters.sql}
  `;

  const [rows] = await db.execute(listQuery, [
    userId,
    ...filters.params,
  ]);

  const [countRows] = await db.execute(countQuery, [
    userId,
    ...filters.params,
  ]);

  return {
    members: rows,
    total: Number(countRows[0]?.total || 0),
  };
}

async function getLeaderMemberById(userId, memberId) {
  const query = `
    ${MEMBER_SELECT}
      AND m.id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [userId, memberId]);
  return rows[0] || null;
}

async function updateLeaderMember(userId, memberId, input = {}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Verify the member is assigned to an active ministry
    // that this authenticated user actively leads.
    const [accessRows] = await connection.execute(
      `
        SELECT DISTINCT m.id, m.user_id
        FROM members m
        INNER JOIN ministry_members target_assignment
          ON target_assignment.member_id = m.id
        INNER JOIN ministries target_ministry
          ON target_ministry.id = target_assignment.ministry_id
        WHERE m.id = ?
          AND target_assignment.status = 'Active'
          AND target_ministry.status = 'Active'
          AND EXISTS (
            SELECT 1
            FROM ministry_members leader_assignment
            INNER JOIN members leader_member
              ON leader_member.id = leader_assignment.member_id
            INNER JOIN users leader_user
              ON leader_user.id = leader_member.user_id
            WHERE leader_assignment.ministry_id =
                  target_assignment.ministry_id
              AND leader_assignment.assignment_role = 'Ministry Leader'
              AND leader_assignment.status = 'Active'
              AND leader_member.status = 'Active'
              AND leader_user.is_active = 1
              AND leader_user.id = ?
          )
        LIMIT 1
      `,
      [memberId, userId]
    );

    if (!accessRows.length) {
      const error = new Error(
        "Member not found in your assigned ministry."
      );
      error.statusCode = 404;
      throw error;
    }

    const userFields = [
      "first_name",
      "middle_name",
      "last_name",
      "email",
      "profile_image",
    ];

    const memberFields = [
      "gender",
      "date_of_birth",
      "baptism_date",
      "address",
      "status",
    ];

    const userUpdates = {};
    const memberUpdates = {};

    for (const field of userFields) {
      if (Object.prototype.hasOwnProperty.call(input, field)) {
        userUpdates[field] = input[field] === "" ? null : input[field];
      }
    }

    for (const field of memberFields) {
      if (Object.prototype.hasOwnProperty.call(input, field)) {
        memberUpdates[field] = input[field] === "" ? null : input[field];
      }
    }

    if (Object.prototype.hasOwnProperty.call(input, "phone")) {
      const phone = input.phone === "" ? null : input.phone;
      userUpdates.phone = phone;
      memberUpdates.phone = phone;
    }

    if (
      memberUpdates.status !== undefined &&
      !["Active", "Inactive"].includes(memberUpdates.status)
    ) {
      const error = new Error("Status must be Active or Inactive.");
      error.statusCode = 400;
      throw error;
    }

    if (
      Object.keys(userUpdates).length === 0 &&
      Object.keys(memberUpdates).length === 0
    ) {
      const error = new Error("No supported member fields were provided.");
      error.statusCode = 400;
      throw error;
    }

    if (Object.keys(userUpdates).length > 0) {
      const fields = Object.keys(userUpdates);
      const assignments = fields.map((field) => `\`${field}\` = ?`);

      await connection.execute(
        `UPDATE users
         SET ${assignments.join(", ")}
         WHERE id = ?`,
        [
          ...fields.map((field) => userUpdates[field]),
          accessRows[0].user_id,
        ]
      );
    }

    if (Object.keys(memberUpdates).length > 0) {
      const fields = Object.keys(memberUpdates);
      const assignments = fields.map((field) => `\`${field}\` = ?`);

      await connection.execute(
        `UPDATE members
         SET ${assignments.join(", ")}
         WHERE id = ?`,
        [
          ...fields.map((field) => memberUpdates[field]),
          memberId,
        ]
      );
    }

    await connection.commit();

    return await getLeaderMemberById(userId, memberId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getLeaderMembers,
  getLeaderMemberById,
  updateLeaderMember,
};
