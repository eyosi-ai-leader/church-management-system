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
    WHERE m.id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [memberId]);

  return rows[0] || null;
};

/**
 * Update member
 */
const updateMember = async (
  memberId,
  {
    memberNumber,
    gender,
    phone,
    dateOfBirth,
    baptismDate,
    address,
    status,
  }
) => {
  const query = `
    UPDATE members
    SET
      member_number = ?,
      gender = ?,
      phone = ?,
      date_of_birth = ?,
      baptism_date = ?,
      address = ?,
      status = ?
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [
    memberNumber,
    gender,
    phone || null,
    dateOfBirth || null,
    baptismDate || null,
    address || null,
    status,
    memberId,
  ]);

  return result;
};

/**
 * Delete member
 */
const deleteMember = async (memberId) => {
  const query = `
    DELETE FROM members
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [memberId]);

  return result;
};

// /**
//  * Get all members with pagination,
//  * optional search, status filter, and role filter.
//  *
//  * Search fields:
//  * - first_name
//  * - last_name
//  * - email
//  * - member_number
//  * - phone
//  *
//  * Status values:
//  * - Active
//  * - Inactive
//  *
//  * Role IDs:
//  * - 1 = Admin
//  * - 2 = Pastor
//  * - 3 = Ministry Leader
//  * - 4 = Member
//  */
// const getAllMembers = async (
//   limit,
//   offset,
//   search = "",
//   status = "",
//   roleId = ""
// ) => {
//   let query = `
//     SELECT
//       m.id,
//       m.user_id,
//       m.member_number,
//       u.first_name,
//       u.last_name,
//       u.email,
//       u.role_id,
//       m.gender,
//       m.phone,
//       m.date_of_birth,
//       m.baptism_date,
//       m.address,
//       m.status,
//       m.created_at,
//       m.updated_at
//     FROM members m
//     INNER JOIN users u
//       ON m.user_id = u.id
//   `;

//   const conditions = [];
//   const queryParams = [];

//   /**
//    * Search condition
//    */
//   if (search) {
//     conditions.push(`
//       (
//         u.first_name LIKE ?
//         OR u.last_name LIKE ?
//         OR u.email LIKE ?
//         OR m.member_number LIKE ?
//         OR m.phone LIKE ?
//       )
//     `);

//     const searchTerm = `%${search}%`;

//     queryParams.push(
//       searchTerm,
//       searchTerm,
//       searchTerm,
//       searchTerm,
//       searchTerm
//     );
//   }

//   /**
//    * Status condition
//    */
//   if (status) {
//     conditions.push("m.status = ?");
//     queryParams.push(status);
//   }

//   /**
//    * Role condition
//    */
//   if (roleId) {
//     conditions.push("u.role_id = ?");
//     queryParams.push(roleId);
//   }

//   /**
//    * Add WHERE only when there are conditions.
//    */
//   if (conditions.length > 0) {
//     query += `
//       WHERE ${conditions.join(" AND ")}
//     `;
//   }

//   query += `
//     ORDER BY m.id ASC
//     LIMIT ? OFFSET ?
//   `;

//   queryParams.push(limit, offset);

//   const [rows] = await db.execute(query, queryParams);

//   return rows;
// };

/**
 * Get all members with pagination,
 * optional search, status filter, role filter,
 * and sorting.
 *
 * Search fields:
 * - first_name
 * - last_name
 * - email
 * - member_number
 * - phone
 *
 * Status values:
 * - Active
 * - Inactive
 *
 * Role IDs:
 * - 1 = Admin
 * - 2 = Pastor
 * - 3 = Ministry Leader
 * - 4 = Member
 *
 * Sortable fields:
 * - first_name
 * - last_name
 * - member_number
 * - email
 * - created_at
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
  `;

  const conditions = [];
  const queryParams = [];

  /**
   * Search condition
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
   * Status condition
   */
  if (status) {
    conditions.push("m.status = ?");
    queryParams.push(status);
  }

  /**
   * Role condition
   */
  if (roleId) {
    conditions.push("u.role_id = ?");
    queryParams.push(roleId);
  }

  /**
   * Add WHERE only when there are conditions.
   */
  if (conditions.length > 0) {
    query += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  /**
   * Allowed sorting fields.
   *
   * This whitelist prevents SQL injection
   * through the sortBy parameter.
   */
  const allowedSortFields = {
    first_name: "u.first_name",
    last_name: "u.last_name",
    member_number: "m.member_number",
    email: "u.email",
    created_at: "m.created_at",
  };

  /**
   * Use created_at as the default
   * when sortBy is not provided.
   */
  const sortColumn =
    allowedSortFields[sortBy] || allowedSortFields.created_at;

  /**
   * Only allow ASC or DESC.
   */
  const sortDirection =
    sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  /**
   * Sorting + pagination
   */
  query += `
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT ? OFFSET ?
  `;

  queryParams.push(limit, offset);

  const [rows] = await db.execute(query, queryParams);

  return rows;
};

/**
 * Count members with optional search,
 * status filter, and role filter.
 *
 * The conditions must match getAllMembers()
 * so pagination returns the correct total
 * and totalPages.
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
   * Search condition
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
   * Status condition
   */
  if (status) {
    conditions.push("m.status = ?");
    queryParams.push(status);
  }

  /**
   * Role condition
   */
  if (roleId) {
    conditions.push("u.role_id = ?");
    queryParams.push(roleId);
  }

  /**
   * Add WHERE only when there are conditions.
   */
  if (conditions.length > 0) {
    query += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  const [rows] = await db.execute(query, queryParams);

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