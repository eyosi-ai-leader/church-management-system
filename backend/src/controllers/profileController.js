const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const profileModel = require("../models/profileModel");
const memberService = require("../services/memberService");

const toProfile = (row) => ({
  userId: row.user_id,
  memberId: row.member_id || null,
  firstName: row.first_name,
  middleName: row.middle_name || "",
  lastName: row.last_name,
  email: row.email,
  phone: row.member_phone || row.user_phone || "",
  profileImage: row.profile_image || null,
  roleId: row.role_id,
  roleName: row.role_name || "",
  memberNumber: row.member_number || "",
  gender: row.gender || "",
  dateOfBirth: row.date_of_birth || "",
  baptismDate: row.baptism_date || "",
  address: row.address || "",
  status: row.status || "",
  createdAt: row.user_created_at,
});

const text = (value) =>
  typeof value === "string" ? value.trim() : undefined;

const getMyProfile = async (req, res) => {
  try {
    const row = await profileModel.getProfileByUserId(req.user.id);

    if (!row) {
      return errorResponse(res, "Account not found.", 404);
    }

    return successResponse(res, "Profile retrieved successfully", toProfile(row));
  } catch (error) {
    console.error("Get profile failed:", error.message);

    return errorResponse(res, "We couldn't load your profile.", 500);
  }
};

const updateMyProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, errors.array());
  }

  try {
    const row = await profileModel.getProfileByUserId(req.user.id);

    if (!row || !row.member_id) {
      return errorResponse(
        res,
        "Your member record was not found. Please contact the church office.",
        409
      );
    }

    /*
     * Only these fields are editable by the person themselves.
     * Email, role, status, member number and baptism date are
     * managed by the church office and are never read from the body.
     */
    await memberService.updateMember(
      row.member_id,
      {
        firstName: text(req.body.firstName),
        middleName: text(req.body.middleName),
        lastName: text(req.body.lastName),
        phone: text(req.body.phone),
        gender: text(req.body.gender),
        dateOfBirth: text(req.body.dateOfBirth),
        address: text(req.body.address),
        removeProfileImage: req.body.removeProfileImage === "true",
      },
      req.file || null
    );

    const updated = await profileModel.getProfileByUserId(req.user.id);

    return successResponse(
      res,
      "Profile updated successfully",
      toProfile(updated)
    );
  } catch (error) {
    console.error("Update profile failed:", error.message);

    return errorResponse(
      res,
      error.statusCode ? error.message : "We couldn't update your profile.",
      error.statusCode || 500
    );
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};