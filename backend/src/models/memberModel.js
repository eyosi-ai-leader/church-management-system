const db = require("../config/db");

/**
 * Create User + Member
 * Member number is generated automatically.
 */
const createMember = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  roleId,
  phone,
  profileImage,
  gender,
  dateOfBirth,
  baptismDate,
  address,
  status,
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /**
     * Create user
     */
    const userQuery = `
      INSERT INTO users (
        first_name,
        middle_name,
        last_name,
        email,
        password,
        role_id,
        phone,
        profile_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [userResult] =
      await connection.execute(
        userQuery,
        [
          firstName,
          middleName || null,
          lastName,
          email,
          password,
          roleId,
          phone || null,
          profileImage || null,
        ]
      );

    const userId =
      userResult.insertId;

    /**
     * Generate next member number.
     *
     * Existing formats supported:
     * MEM-0001
     * CHMS-2026-0001
     *
     * Old/custom values such as 2345
     * are ignored.
     */
    const sequenceQuery = `
      SELECT
        MAX(
          CASE
            WHEN member_number REGEXP '^CHMS-[0-9]{4}-[0-9]+$'
              THEN CAST(
                SUBSTRING_INDEX(
                  member_number,
                  '-',
                  -1
                ) AS UNSIGNED
              )

            WHEN member_number REGEXP '^MEM-[0-9]+$'
              THEN CAST(
                SUBSTRING(
                  member_number,
                  5
                ) AS UNSIGNED
              )

            ELSE 0
          END
        ) AS max_sequence
      FROM members
    `;

    const [sequenceRows] =
      await connection.execute(
        sequenceQuery
      );

    const maxSequence =
      Number(
        sequenceRows[0]?.max_sequence || 0
      );

    const nextSequence =
      maxSequence + 1;

    const currentYear =
      new Date().getFullYear();

    const memberNumber =
      `CHMS-${currentYear}-${String(
        nextSequence
      ).padStart(4, "0")}`;

    /**
     * Create member
     */
    const memberQuery = `
      INSERT INTO members (
        user_id,
        member_number,
        gender,
        phone,
        date_of_birth,
        baptism_date,
        address,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [memberResult] =
      await connection.execute(
        memberQuery,
        [
          userId,
          memberNumber,
          gender || null,
          phone || null,
          dateOfBirth || null,
          baptismDate || null,
          address || null,
          status || "Active",
        ]
      );

    await connection.commit();

    return {
      userId,
      memberId:
        memberResult.insertId,
      memberNumber,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get member by ID
 */
const getMemberById = async (
  memberId
) => {
  const query = `
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

    WHERE m.id = ?

    LIMIT 1
  `;

  const [rows] =
    await db.execute(
      query,
      [memberId]
    );

  return rows[0] || null;
};

/**
 * Get member by authenticated user ID
 *
 * Used by the Member dashboard.
 *
 * This is important because a Member should
 * only access their own member information.
 */
const getMemberByUserId = async (
  userId
) => {
  const query = `
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
  `;

  const [rows] =
    await db.execute(
      query,
      [userId]
    );

  return rows[0] || null;
};


/**
 * Update member
 *
 * Member number is NOT updated.
 * It is a permanent system-generated identity.
 */
const updateMember = async (
  memberId,
  userId,
  {
    firstName,
    middleName,
    lastName,
    email,
    roleId,
    phone,
    profileImage,
    gender,
    dateOfBirth,
    baptismDate,
    address,
    status,
  }
) => {
  const connection =
    await db.getConnection();

  try {
    await connection.beginTransaction();

    /**
     * Update user
     *
     * profileImage can be:
     * - existing image URL
     * - new Cloudinary image URL
     * - null when image is removed
     */
    const userQuery = `
      UPDATE users
      SET
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        email = ?,
        role_id = ?,
        phone = ?,
        profile_image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.execute(
      userQuery,
      [
        firstName,
        middleName || null,
        lastName,
        email,
        roleId,
        phone || null,
        profileImage || null,
        userId,
      ]
    );

    /**
     * Update member
     *
     * member_number intentionally excluded.
     */
    const memberQuery = `
      UPDATE members
      SET
        gender = ?,
        phone = ?,
        date_of_birth = ?,
        baptism_date = ?,
        address = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] =
      await connection.execute(
        memberQuery,
        [
          gender || null,
          phone || null,
          dateOfBirth || null,
          baptismDate || null,
          address || null,
          status || "Active",
          memberId,
        ]
      );

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


/**
 * Delete member
 */
const deleteMember = async (
  memberId
) => {
  const query = `
    DELETE FROM members
    WHERE id = ?
  `;

  const [result] =
    await db.execute(
      query,
      [memberId]
    );

  return result;
};

/**
 * Get all members
 *
 * IMPORTANT:
 * This function accepts ONE options object.
 *
 * This matches memberService.getAllMembers().
 */
const getAllMembers = async ({
  limit = 10,
  offset = 0,
  search = "",
  status = "",
  roleId = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = {}) => {
  let query = `
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
  `;

  const conditions = [];
  const queryParams = [];

  /**
   * Search
   */
  if (search) {
    conditions.push(`
      (
        u.first_name LIKE ?
        OR u.middle_name LIKE ?
        OR u.last_name LIKE ?
        OR u.email LIKE ?
        OR m.member_number LIKE ?
        OR m.phone LIKE ?
      )
    `);

    const searchTerm =
      `%${search}%`;

    queryParams.push(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm
    );
  }

  /**
   * Status
   */
  if (status) {
    conditions.push(
      "m.status = ?"
    );

    queryParams.push(status);
  }

  /**
   * Role
   */
  if (roleId) {
    conditions.push(
      "u.role_id = ?"
    );

    queryParams.push(roleId);
  }

  /**
   * WHERE
   */
  if (conditions.length > 0) {
    query += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  /**
   * Sorting whitelist
   *
   * Only these values can reach
   * the SQL ORDER BY clause.
   */
  const allowedSortFields = {
    first_name: "u.first_name",
    last_name: "u.last_name",
    member_number: "m.member_number",
    email: "u.email",
    created_at: "m.created_at",
  };

  const sortColumn =
    allowedSortFields[sortBy] ||
    allowedSortFields.created_at;

  const sortDirection =
    sortOrder === "desc"
      ? "DESC"
      : "ASC";

  query += `
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT ? OFFSET ?
  `;

  /**
   * Always provide actual numeric values
   * to mysql2 for LIMIT/OFFSET.
   *
   * This prevents undefined bind parameters.
   */
  queryParams.push(
    Number(limit),
    Number(offset)
  );

  const [rows] =
    await db.execute(
      query,
      queryParams
    );

  return rows;
};

/**
 * Count members
 *
 * IMPORTANT:
 * This function accepts ONE options object.
 *
 * This matches memberService.countMembers().
 */
const countMembers = async ({
  search = "",
  status = "",
  roleId = "",
} = {}) => {
  let query = `
    SELECT COUNT(*) AS total

    FROM members m

    INNER JOIN users u
      ON m.user_id = u.id
  `;

  const conditions = [];
  const queryParams = [];

  /**
   * Search
   */
  if (search) {
    conditions.push(`
      (
        u.first_name LIKE ?
        OR u.middle_name LIKE ?
        OR u.last_name LIKE ?
        OR u.email LIKE ?
        OR m.member_number LIKE ?
        OR m.phone LIKE ?
      )
    `);

    const searchTerm =
      `%${search}%`;

    queryParams.push(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm
    );
  }

  /**
   * Status
   */
  if (status) {
    conditions.push(
      "m.status = ?"
    );

    queryParams.push(status);
  }

  /**
   * Role
   */
  if (roleId) {
    conditions.push(
      "u.role_id = ?"
    );

    queryParams.push(roleId);
  }

  /**
   * WHERE
   */
  if (conditions.length > 0) {
    query += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  const [rows] =
    await db.execute(
      query,
      queryParams
    );

  return Number(
    rows[0]?.total || 0
  );
};

module.exports = {
  createMember,
  getMemberById,
  getMemberByUserId,
  updateMember,
  deleteMember,
  getAllMembers,
  countMembers,
};