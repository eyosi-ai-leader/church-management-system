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
 * Extract Cloudinary public ID from a secure URL.
 *
 * Example:
 * https://res.cloudinary.com/demo/image/upload/v1234567890/chms/member-profiles/photo.jpg
 *
 * Returns:
 * chms/member-profiles/photo
 */
const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  try {
    const url = new URL(imageUrl);

    const uploadPath = "/upload/";

    const uploadIndex =
      url.pathname.indexOf(uploadPath);

    if (uploadIndex === -1) {
      return null;
    }

    let publicPath =
      url.pathname.substring(
        uploadIndex + uploadPath.length
      );

    /**
     * Remove Cloudinary version:
     *
     * v1234567890/chms/member-profiles/photo.jpg
     *
     * becomes:
     * chms/member-profiles/photo.jpg
     */
    publicPath =
      publicPath.replace(
        /^v\d+\//,
        ""
      );

    /**
     * Remove file extension.
     */
    publicPath =
      publicPath.replace(
        /\.[^/.]+$/,
        ""
      );

    return decodeURIComponent(
      publicPath
    );
  } catch (error) {
    console.error(
      "Failed to extract Cloudinary public ID:",
      error.message
    );

    return null;
  }
};

/**
 * Update member
 *
 * Supports:
 * - Personal information
 * - Account information
 * - Church information
 * - Profile image upload
 * - Profile image replacement
 * - Profile image removal
 */
const updateMember = async (
  memberId,
  memberData,
  profileImage = null
) => {
  /**
   * First retrieve the existing member.
   *
   * This gives us:
   * - user_id
   * - existing member information
   * - existing profile image
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
   * Existing Cloudinary image.
   */
  const oldProfileImage =
    existingMember.profile_image || null;

  /**
   * Determine whether the user requested
   * profile image removal.
   */
  const removeProfileImage =
    memberData.removeProfileImage === true;

  /**
   * This will contain the newly uploaded
   * Cloudinary image if one is uploaded.
   */
  let uploadedImage = null;

  try {
    /**
     * Upload new profile image first.
     *
     * We do this BEFORE changing the database.
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
     * Determine which profile image URL
     * should be stored in the database.
     *
     * Case 1:
     * New image uploaded
     * → save new image URL
     *
     * Case 2:
     * Remove requested
     * → save null
     *
     * Case 3:
     * Nothing changed
     * → keep existing image URL
     */
    let profileImageUrl =
      oldProfileImage;

    if (uploadedImage) {
      profileImageUrl =
        uploadedImage.secureUrl;
    } else if (
      removeProfileImage
    ) {
      profileImageUrl = null;
    }

    /**
     * Merge incoming data with
     * existing member data.
     */
    const updatedData = {
      firstName:
        memberData.firstName ??
        existingMember.first_name,

      middleName:
        memberData.middleName !== undefined
          ? memberData.middleName
          : existingMember.middle_name,

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

      profileImage:
        profileImageUrl,

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

    /**
     * Update database.
     */
    const result =
      await memberModel.updateMember(
        memberId,
        existingMember.user_id,
        updatedData
      );

    /**
     * Database update succeeded.
     *
     * Now remove the old Cloudinary image
     * if it was replaced or removed.
     */
    if (
      oldProfileImage &&
      (
        uploadedImage ||
        removeProfileImage
      )
    ) {
      const oldPublicId =
        getCloudinaryPublicId(
          oldProfileImage
        );

      if (oldPublicId) {
        try {
          await deleteImage(
            oldPublicId
          );
        } catch (deleteError) {
          /**
           * Do not fail the member update
           * just because old Cloudinary
           * cleanup failed.
           *
           * The database already contains
           * the correct image.
           */
          console.error(
            "Failed to delete old profile image:",
            deleteError.message
          );
        }
      }
    }

    return result;
  } catch (error) {
    /**
     * If a new image was uploaded to Cloudinary
     * but the database update failed,
     * remove the newly uploaded image.
     *
     * This prevents orphaned Cloudinary files.
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