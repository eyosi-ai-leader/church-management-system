const bcrypt = require("bcrypt");

const memberModel = require("../models/memberModel");

const {
  uploadImage,
  deleteImage,
} = require("./storageService");

const SALT_ROUNDS = 10;

/**
 * Create member
 *
 * Creates:
 * - User account
 * - Member record
 * - Optional profile image
 */
const createMember = async (
  memberData,
  profileImage = null
) => {
  let uploadedImage = null;

  try {
    const hashedPassword =
      await bcrypt.hash(
        memberData.password,
        SALT_ROUNDS
      );

    /**
     * Upload profile image to Cloudinary
     * before creating the database records.
     */
    if (profileImage) {
      uploadedImage =
        await uploadImage(
          profileImage.buffer,
          {
            folder:
              "chms/member-profiles",
          }
        );
    }

    /**
     * Create user + member
     *
     * Profile image URL is stored
     * in the users table.
     */
    const result =
      await memberModel.createMember({
        ...memberData,

        profileImage:
          uploadedImage?.secureUrl ||
          null,
      });

    return result;
  } catch (error) {
    /**
     * If Cloudinary upload succeeded
     * but database creation failed,
     * remove the uploaded image.
     */
    if (uploadedImage?.publicId) {
      try {
        await deleteImage(
          uploadedImage.publicId
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded profile image:",
          cleanupError.message
        );
      }
    }

    /**
     * Handle duplicate email/member number.
     */
    if (error.code === "ER_DUP_ENTRY") {
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
const getMemberById = async (
  memberId
) => {
  const member =
    await memberModel.getMemberById(
      memberId
    );

  if (!member) {
    const error = new Error(
      "Member not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return member;
};

/**
 * Update member
 */
const updateMember = async (
  memberId,
  memberData
) => {
  /**
   * First retrieve the existing member.
   * This gives us the user_id and allows
   * partial updates.
   */
  const existingMember =
    await memberModel.getMemberById(
      memberId
    );

  if (!existingMember) {
    const error = new Error(
      "Member not found."
    );

    error.statusCode = 404;

    throw error;
  }

  /**
   * Merge incoming data with existing data.
   */
  const updatedData = {
    firstName:
      memberData.firstName ??
      existingMember.first_name,

    middleName:
      memberData.middleName ??
      existingMember.middle_name,

    lastName:
      memberData.lastName ??
      existingMember.last_name,

    email:
      memberData.email ??
      existingMember.email,

    phone:
      memberData.phone ??
      existingMember.phone,

    roleId:
      memberData.roleId ??
      existingMember.role_id,

    gender:
      memberData.gender ??
      existingMember.gender,

    dateOfBirth:
      memberData.dateOfBirth ??
      existingMember.date_of_birth,

    baptismDate:
      memberData.baptismDate ??
      existingMember.baptism_date,

    address:
      memberData.address ??
      existingMember.address,

    status:
      memberData.status ??
      existingMember.status,
  };

  try {
    return await memberModel.updateMember(
      memberId,
      existingMember.user_id,
      updatedData
    );
  } catch (error) {
    /**
     * Handle duplicate email.
     */
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError =
        new Error(
          "Email already exists."
        );

      duplicateError.statusCode = 409;

      throw duplicateError;
    }

    throw error;
  }
};

/**
 * Delete member
 */
const deleteMember = async (
  memberId
) => {
  /**
   * Verify that the member exists
   * before deleting.
   */
  const existingMember =
    await memberModel.getMemberById(
      memberId
    );

  if (!existingMember) {
    const error = new Error(
      "Member not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return memberModel.deleteMember(
    memberId
  );
};

/**
 * Get all members
 *
 * Supports:
 * - Pagination
 * - Search
 * - Status filter
 * - Role filter
 * - Sorting
 *
 * IMPORTANT:
 * This function expects ONE options object.
 */
const getAllMembers = async (
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    roleId = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  /**
   * Calculate database offset.
   */
  const offset =
    (page - 1) * limit;

  /**
   * Get members and total count
   * at the same time.
   */
  const [
    members,
    total,
  ] = await Promise.all([
    memberModel.getAllMembers({
      limit,
      offset,
      search,
      status,
      roleId,
      sortBy,
      sortOrder,
    }),

    memberModel.countMembers({
      search,
      status,
      roleId,
    }),
  ]);

  return {
    members,

    pagination: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
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