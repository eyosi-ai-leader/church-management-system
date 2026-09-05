const bcrypt = require("bcrypt");

const memberModel = require("../models/memberModel");
const {
  uploadImage,
  deleteImage,
} = require("./storageService");

const SALT_ROUNDS = 10;

const createMember = async (memberData, profileImage = null) => {
  let uploadedImage = null;

  try {
    const hashedPassword = await bcrypt.hash(
      memberData.password,
      SALT_ROUNDS
    );

    if (profileImage) {
      uploadedImage = await uploadImage(
        profileImage.buffer,
        {
          folder: "chms/member-profiles",
        }
      );
    }

    const result =
      await memberModel.createMember({
        ...memberData,
        profileImage:
          uploadedImage?.secureUrl || null,
      });

    return result;
  } catch (error) {
    // If Cloudinary upload succeeded but
    // database creation failed, remove the
    // uploaded image from Cloudinary.
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

const getMemberById = async (memberId) => {
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
      "Member not found."
    );

    error.statusCode = 404;

    throw error;
  }

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

const deleteMember = async (memberId) => {
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

const getAllMembers = async (options) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    roleId = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  const offset =
    (page - 1) * limit;

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
      totalPages: Math.ceil(
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