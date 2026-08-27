const memberModel = require("../models/memberModel");

/**
 * Create member
 */
const createMember = async (memberData) => {
  return await memberModel.createMember(
    memberData
  );
};

/**
 * Get member by ID
 */
const getMemberById = async (memberId) => {
  const member =
    await memberModel.getMemberById(
      memberId
    );

  if (!member) {
    const error = new Error(
      "Member not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return member;
};

/**
 * Update member
 *
 * Updates both:
 *
 * users:
 * - first_name
 * - last_name
 * - email
 * - phone
 * - role_id
 *
 * members:
 * - member_number
 * - gender
 * - phone
 * - date_of_birth
 * - baptism_date
 * - address
 * - status
 */
const updateMember = async (
  memberId,
  memberData
) => {
  const existingMember =
    await memberModel.getMemberById(
      memberId
    );

  if (!existingMember) {
    const error = new Error(
      "Member not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const updatedData = {
    firstName:
      memberData.firstName !== undefined
        ? memberData.firstName
        : existingMember.first_name,

    lastName:
      memberData.lastName !== undefined
        ? memberData.lastName
        : existingMember.last_name,

    email:
      memberData.email !== undefined
        ? memberData.email
        : existingMember.email,

    roleId:
      memberData.roleId !== undefined
        ? memberData.roleId
        : existingMember.role_id,

    phone:
      memberData.phone !== undefined
        ? memberData.phone
        : (
            existingMember.user_phone ??
            existingMember.phone
          ),

    memberNumber:
      memberData.memberNumber !== undefined
        ? memberData.memberNumber
        : existingMember.member_number,

    gender:
      memberData.gender !== undefined
        ? memberData.gender
        : existingMember.gender,

    dateOfBirth:
      memberData.dateOfBirth !== undefined
        ? memberData.dateOfBirth
        : existingMember.date_of_birth,

    baptismDate:
      memberData.baptismDate !== undefined
        ? memberData.baptismDate
        : existingMember.baptism_date,

    address:
      memberData.address !== undefined
        ? memberData.address
        : existingMember.address,

    status:
      memberData.status !== undefined
        ? memberData.status
        : existingMember.status,
  };

  return await memberModel.updateMember(
    memberId,
    existingMember.user_id,
    updatedData
  );
};

/**
 * Delete member
 */
const deleteMember = async (memberId) => {
  const existingMember =
    await memberModel.getMemberById(
      memberId
    );

  if (!existingMember) {
    const error = new Error(
      "Member not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return await memberModel.deleteMember(
    memberId
  );
};

/**
 * Get all members with:
 *
 * - Pagination
 * - Search
 * - Status filter
 * - Role filter
 * - Sorting
 */
const getAllMembers = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  roleId = "",
  sortBy = "created_at",
  sortOrder = "asc"
) => {
  const offset =
    (page - 1) * limit;

  const [
    members,
    total,
  ] = await Promise.all([
    memberModel.getAllMembers(
      limit,
      offset,
      search,
      status,
      roleId,
      sortBy,
      sortOrder
    ),

    memberModel.countMembers(
      search,
      status,
      roleId
    ),
  ]);

  const totalPages =
    Math.ceil(total / limit);

  return {
    members,

    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

module.exports = {
  createMember,
  getMemberById,
  updateMember,
  deleteMember,
  getAllMembers,
};