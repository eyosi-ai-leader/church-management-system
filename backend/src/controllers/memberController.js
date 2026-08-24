const memberService = require("../services/memberService");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

/**
 * Create member
 */
const createMember = async (req, res) => {
  try {
    const result =
      await memberService.createMember(req.body);

    return successResponse(
      res,
      "Member created successfully",
      {
        memberId: result.insertId,
      },
      201
    );
  } catch (error) {
    console.error("Create member error:", error);

    return errorResponse(
      res,
      error.message ||
        "Failed to create member",
      error.statusCode || 500
    );
  }
};

/**
 * Get member by ID
 */
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member =
      await memberService.getMemberById(id);

    return successResponse(
      res,
      "Member retrieved successfully",
      member,
      200
    );
  } catch (error) {
    console.error("Get member error:", error);

    return errorResponse(
      res,
      error.message ||
        "Failed to retrieve member",
      error.statusCode || 500
    );
  }
};

/**
 * Update member
 */
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    await memberService.updateMember(
      id,
      req.body
    );

    const updatedMember =
      await memberService.getMemberById(id);

    return successResponse(
      res,
      "Member updated successfully",
      updatedMember,
      200
    );
  } catch (error) {
    console.error("Update member error:", error);

    return errorResponse(
      res,
      error.message ||
        "Failed to update member",
      error.statusCode || 500
    );
  }
};

/**
 * Delete member
 */
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    await memberService.deleteMember(id);

    return successResponse(
      res,
      "Member deleted successfully",
      null,
      200
    );
  } catch (error) {
    console.error("Delete member error:", error);

    return errorResponse(
      res,
      error.message ||
        "Failed to delete member",
      error.statusCode || 500
    );
  }
};

/**
 * Get all members
 *
 * Supports:
 *
 * Pagination:
 * GET /api/members?page=1&limit=10
 *
 * Search:
 * GET /api/members?search=Abebe
 *
 * Status:
 * GET /api/members?status=Active
 *
 * Roles:
 *
 * 1 = Admin
 * 2 = Pastor
 * 3 = Church Elder
 * 4 = Ministry Leader
 * 5 = Member
 *
 * Example:
 * GET /api/members?roleId=3
 *
 * Sorting:
 * GET /api/members?sortBy=first_name&sortOrder=asc
 */
const getAllMembers = async (req, res) => {
  try {
    const page =
      req.query.page !== undefined
        ? Number(req.query.page)
        : 1;

    const limit =
      req.query.limit !== undefined
        ? Number(req.query.limit)
        : 10;

    const search =
      req.query.search !== undefined
        ? req.query.search.trim()
        : "";

    const status =
      req.query.status !== undefined
        ? req.query.status.trim()
        : "";

    const roleId =
      req.query.roleId !== undefined
        ? Number(req.query.roleId)
        : "";

    const sortBy =
      req.query.sortBy !== undefined
        ? req.query.sortBy.trim()
        : "created_at";

    const sortOrder =
      req.query.sortOrder !== undefined
        ? req.query.sortOrder
            .trim()
            .toLowerCase()
        : "asc";

    /**
     * Validate page
     */
    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      return errorResponse(
        res,
        "Page must be greater than or equal to 1",
        400
      );
    }

    /**
     * Validate limit
     */
    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return errorResponse(
        res,
        "Limit must be between 1 and 100",
        400
      );
    }

    /**
     * Validate status
     */
    if (
      status &&
      status !== "Active" &&
      status !== "Inactive"
    ) {
      return errorResponse(
        res,
        "Status must be either Active or Inactive",
        400
      );
    }

    /**
     * Validate roleId
     *
     * 1 = Admin
     * 2 = Pastor
     * 3 = Church Elder
     * 4 = Ministry Leader
     * 5 = Member
     */
    if (
      roleId !== "" &&
      (
        !Number.isInteger(roleId) ||
        roleId < 1 ||
        roleId > 5
      )
    ) {
      return errorResponse(
        res,
        "Role ID must be between 1 and 5",
        400
      );
    }

    /**
     * Validate sortBy
     */
    const allowedSortFields = [
      "first_name",
      "last_name",
      "member_number",
      "email",
      "created_at",
    ];

    if (
      !allowedSortFields.includes(sortBy)
    ) {
      return errorResponse(
        res,
        "Invalid sort field. Allowed fields are first_name, last_name, member_number, email, and created_at",
        400
      );
    }

    /**
     * Validate sortOrder
     */
    if (
      sortOrder !== "asc" &&
      sortOrder !== "desc"
    ) {
      return errorResponse(
        res,
        "Sort order must be either asc or desc",
        400
      );
    }

    const result =
      await memberService.getAllMembers(
        page,
        limit,
        search,
        status,
        roleId,
        sortBy,
        sortOrder
      );

    return res.status(200).json({
      success: true,
      message:
        "Members retrieved successfully",
      data: result.members,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(
      "Get all members error:",
      error
    );

    return errorResponse(
      res,
      error.message ||
        "Failed to retrieve members",
      error.statusCode || 500
    );
  }
};

module.exports = {
  createMember,
  getMemberById,
  updateMember,
  deleteMember,
  getAllMembers,
};