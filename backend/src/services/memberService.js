const memberModel = require("../models/memberModel");

/**
 * Create member
 */
const createMember = async (memberData) => {
  return await memberModel.createMember(memberData);
};

/**
 * Get member by ID
 */
const getMemberById = async (memberId) => {
  const member = await memberModel.getMemberById(memberId);

  if (!member) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  return member;
};

/**
 * Update member
 */
const updateMember = async (memberId, memberData) => {
  const existingMember = await memberModel.getMemberById(memberId);

  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedData = {
    memberNumber:
      memberData.memberNumber ?? existingMember.member_number,

    gender:
      memberData.gender ?? existingMember.gender,

    phone:
      memberData.phone !== undefined
        ? memberData.phone
        : existingMember.phone,

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
      memberData.status ?? existingMember.status,
  };

  return await memberModel.updateMember(
    memberId,
    updatedData
  );
};

/**
 * Delete member
 */
const deleteMember = async (memberId) => {
  const existingMember = await memberModel.getMemberById(memberId);

  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  return await memberModel.deleteMember(memberId);
};

// /**
//  * Get all members with pagination,
//  * search, status filter, and role filter
//  */
// const getAllMembers = async (
//   page = 1,
//   limit = 10,
//   search = "",
//   status = "",
//   roleId = ""
// ) => {
//   const offset = (page - 1) * limit;

//   const [members, total] = await Promise.all([
//     memberModel.getAllMembers(
//       limit,
//       offset,
//       search,
//       status,
//       roleId
//     ),

//     memberModel.countMembers(
//       search,
//       status,
//       roleId
//     ),
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   return {
//     members,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages,
//     },
//   };
// };

/**
 * Get all members with pagination,
 * search, status filter, role filter, and sorting
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
  const offset = (page - 1) * limit;

  const [members, total] = await Promise.all([
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

  const totalPages = Math.ceil(total / limit);

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