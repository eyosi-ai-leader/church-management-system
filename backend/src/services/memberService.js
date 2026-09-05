const bcrypt = require("bcrypt");
const memberModel = require("../models/memberModel");

/**
 * Create member
 *
 * Creates both:
 * - User account
 * - Member profile
 *
 * Password is hashed before it reaches the model.
 *
 * Member number is generated automatically
 * by the member model.
 */
const createMember = async (memberData) => {
  try {
    const hashedPassword =
      await bcrypt.hash(
        memberData.password,
        10
      );

    const memberWithHashedPassword = {
      ...memberData,
      password: hashedPassword,
    };

    return await memberModel.createMember(
      memberWithHashedPassword
    );
  } catch (error) {
    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      const duplicateError =
        new Error(
          "Email or member number already exists."
        );

      duplicateError.statusCode = 409;

      throw duplicateError;
    }

    throw error;
  }
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
 * - middle_name
 * - last_name
 * - email
 * - phone
 * - role_id
 *
 * members:
 * - gender
 * - phone
 * - date_of_birth
 * - baptism_date
 * - address
 * - status
 *
 * Member number is NOT updated because it is
 * a permanent system-generated identity.
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

    middleName:
      memberData.middleName !== undefined
        ? memberData.middleName
        : existingMember.middle_name,

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