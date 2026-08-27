const db = require("../config/db");

/**
 * Create a new member
 */
const createMember = async ({
  userId,
  memberNumber,
  gender,
  phone,
  dateOfBirth,
  baptismDate,
  address,
}) => {
  const query = `
    INSERT INTO members (
      user_id,
      member_number,
      gender,
      phone,
      date_of_birth,
      baptism_date,
      address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    memberNumber,
    gender,
    phone || null,
    dateOfBirth || null,
    baptismDate || null,
    address || null,
  ]);

  return result;
};

/**
 * Get member by ID
 */
const getMemberById = async (memberId) => {
  const query = `
    SELECT
      m.id,
      m.user_id,
      m.member_number,

      u.first_name,
      u.last_name,
      u.email,
      u.role_id,
      r.name AS role_name,
      u.phone AS user_phone,

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

  const [rows] = await db.execute(query, [
    memberId,
  ]);

  return rows[0] || null;
};

/**
 * Update member
 *
 * Updates:
 *
 * users:
 * - first_name
 * - last_name
 * - email
 * - role_id
 * - phone
 *
 * members:
 * - member_number
 * - gender
 * - phone
 * - date_of_birth
 * - baptism_date
 * - address
 * - status
 *
 * Both tables are updated inside one transaction.
 */
const updateMember = async (
  memberId,
  userId,
  {
    firstName,
    lastName,
    email,
    roleId,
    phone,
    memberNumber,
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
     * Update user/account information
     */
    const userQuery = `
      UPDATE users
      SET
        first_name = ?,
        last_name = ?,
        email = ?,
        role_id = ?,
        phone = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.execute(userQuery, [
      firstName,
      lastName,
      email,
      roleId,
      phone || null,
      userId,
    ]);

    /**
     * Update member/church information
     */
    const memberQuery = `
      UPDATE members
      SET
        member_number = ?,
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
          memberNumber,
          gender,
          phone || null,
          dateOfBirth || null,
          baptismDate || null,
          address || null,
          status,
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
const deleteMember = async (memberId) => {
  const query = `
    DELETE FROM members
    WHERE id = ?
  `;

  const [result] = await db.execute(
    query,
    [memberId]
  );

  return result;
};

/**
 * Get all members with:
 *
 * - Pagination
 * - Search
 * - Status filter
 * - Role filter
 * - Sorting
 *
 * Role IDs:
 *
 * 1 = Admin
 * 2 = Pastor
 * 3 = Church Elder
 * 4 = Ministry Leader
 * 5 = Member
 */
const getAllMembers = async (
  limit,
  offset,
  search = "",
  status = "",
  roleId = "",
  sortBy = "created_at",
  sortOrder = "asc"
) => {
  let query = `
    SELECT
      m.id,
      m.user_id,
      m.member_number,

      u.first_name,
      u.last_name,
      u.email,

      u.role_id,
      r.name AS role_name,

      u.phone AS user_phone,

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
        OR u.last_name LIKE ?
        OR u.email LIKE ?
        OR m.member_number LIKE ?
        OR m.phone LIKE ?
      )
    `);

    const searchTerm = `%${search}%`;

    queryParams.push(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm
    );
  }

  /**
   * Status filter
   */
  if (status) {
    conditions.push("m.status = ?");
    queryParams.push(status);
  }

  /**
   * Role filter
   */
  if (roleId) {
    conditions.push("u.role_id = ?");
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
   * Allowed sorting fields
   *
   * Whitelist prevents SQL injection.
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
    sortOrder.toLowerCase() === "desc"
      ? "DESC"
      : "ASC";

  /**
   * Sorting + pagination
   */
  query += `
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT ? OFFSET ?
  `;

  queryParams.push(limit, offset);

  const [rows] = await db.execute(
    query,
    queryParams
  );

  return rows;
};

/**
 * Count members
 */
const countMembers = async (
  search = "",
  status = "",
  roleId = ""
) => {
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
        OR u.last_name LIKE ?
        OR u.email LIKE ?
        OR m.member_number LIKE ?
        OR m.phone LIKE ?
      )
    `);

    const searchTerm = `%${search}%`;

    queryParams.push(
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
    conditions.push("m.status = ?");
    queryParams.push(status);
  }

  /**
   * Role
   */
  if (roleId) {
    conditions.push("u.role_id = ?");
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

  const [rows] = await db.execute(
    query,
    queryParams
  );

  return Number(rows[0].total);
};

module.exports = {
  createMember,
  getMemberById,
  updateMember,
  deleteMember,
  getAllMembers,
  countMembers,
};