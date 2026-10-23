
const ministryMemberService = require("../services/ministryMemberService");
const { successResponse, errorResponse } = require("../utils/response");

const getMyMinistryMembers = async (req, res) => {
  try {
    const result = await ministryMemberService.getMyMinistryMembers(
      req.user.id,
      {
        page: req.query.page ?? 1,
        limit: req.query.limit ?? 10,
        search: req.query.search ?? "",
        status: req.query.status ?? "Active",
        roleId: req.query.roleId ?? "",
        ministryId: req.query.ministryId ?? "",
        sortBy: req.query.sortBy ?? "created_at",
        sortOrder: req.query.sortOrder ?? "desc",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Ministry members retrieved successfully",
      data: result.members,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get ministry members error:", error);

    return errorResponse(
      res,
      error.message || "Failed to retrieve ministry members",
      error.statusCode || 500
    );
  }
};

const getMyMinistryMemberById = async (req, res) => {
  try {
    const member = await ministryMemberService.getMyMinistryMemberById(
      req.user.id,
      req.params.id
    );

    return successResponse(
      res,
      "Ministry member retrieved successfully",
      member,
      200
    );
  } catch (error) {
    console.error("Get ministry member error:", error);

    return errorResponse(
      res,
      error.message || "Failed to retrieve ministry member",
      error.statusCode || 500
    );
  }
};

const updateMyMinistryMember = async (req, res) => {
  try {
    const input = { ...req.body };

    if (req.file) {
      input.profile_image = req.file.filename;
    }

    const member = await ministryMemberService.updateMyMinistryMember(
      req.user.id,
      req.params.id,
      input
    );

    return successResponse(
      res,
      "Ministry member updated successfully",
      member,
      200
    );
  } catch (error) {
    console.error("Update ministry member error:", error);

    return errorResponse(
      res,
      error.message || "Failed to update ministry member",
      error.statusCode || 500
    );
  }
};

module.exports = {
  getMyMinistryMembers,
  getMyMinistryMemberById,
  updateMyMinistryMember,
};
