const memberService = require("../services/memberService");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

/**
 * Create member
 *
 * Creates:
 * - User account
 * - Member record
 *
 * Both are handled by the member service.
 */
const createMember = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      password,
      roleId,
      memberNumber,
      gender,
      dateOfBirth,
      baptismDate,
      address,
      status,
    } = req.body;

    /**
     * Validate first name
     */
    if (
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return errorResponse(
        res,
        "First name is required",
        400
      );
    }

    /**
     * Validate middle name
     *
     * Middle name is optional.
     */
    if (
      middleName !== undefined &&
      middleName !== null &&
      typeof middleName !== "string"
    ) {
      return errorResponse(
        res,
        "Middle name must be a string",
        400
      );
    }

    /**
     * Validate last name
     */
    if (
      typeof lastName !== "string" ||
      !lastName.trim()
    ) {
      return errorResponse(
        res,
        "Last name is required",
        400
      );
    }

    /**
     * Validate email
     */
    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return errorResponse(
        res,
        "Email is required",
        400
      );
    }

    /**
     * Validate email format
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return errorResponse(
        res,
        "Please provide a valid email address",
        400
      );
    }

    /**
     * Validate password
     */
    if (
      typeof password !== "string" ||
      !password
    ) {
      return errorResponse(
        res,
        "Password is required",
        400
      );
    }

    if (password.length < 6) {
      return errorResponse(
        res,
        "Password must be at least 6 characters",
        400
      );
    }

    /**
     * Validate role
     *
     * 1 = Admin
     * 2 = Pastor
     * 3 = Church Elder
     * 4 = Ministry Leader
     * 5 = Member
     */
    if (
      roleId === undefined ||
      roleId === null ||
      !Number.isInteger(Number(roleId)) ||
      Number(roleId) < 1 ||
      Number(roleId) > 5
    ) {
      return errorResponse(
        res,
        "Role ID must be between 1 and 5",
        400
      );
    }

    /**
     * Validate member number
     */
    if (
      typeof memberNumber !== "string" ||
      !memberNumber.trim()
    ) {
      return errorResponse(
        res,
        "Member number is required",
        400
      );
    }

    /**
     * Validate gender when provided
     */
    if (
      gender !== undefined &&
      gender !== null &&
      gender !== "" &&
      gender !== "Male" &&
      gender !== "Female"
    ) {
      return errorResponse(
        res,
        "Gender must be either Male or Female",
        400
      );
    }

    /**
     * Validate status when provided
     */
    if (
      status !== undefined &&
      status !== null &&
      status !== "" &&
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
     * Create user + member
     */
    const result =
      await memberService.createMember({
        firstName: firstName.trim(),

        middleName:
          middleName !== undefined &&
          middleName !== null
            ? middleName.trim()
            : null,

        lastName: lastName.trim(),

        email: email.trim(),

        phone:
          phone !== undefined &&
          phone !== null &&
          phone !== ""
            ? phone.trim()
            : null,

        password,

        roleId: Number(roleId),

        memberNumber:
          memberNumber.trim(),

        gender:
          gender !== undefined &&
          gender !== ""
            ? gender
            : null,

        dateOfBirth:
          dateOfBirth || null,

        baptismDate:
          baptismDate || null,

        address:
          address !== undefined &&
          address !== null &&
          address !== ""
            ? address.trim()
            : null,

        status:
          status !== undefined &&
          status !== ""
            ? status
            : "Active",
      });

    return successResponse(
      res,
      "Member created successfully",
      {
        memberId: result.memberId,
        userId: result.userId,
      },
      201
    );
  } catch (error) {
    console.error(
      "Create member error:",
      error
    );

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
    console.error(
      "Get member error:",
      error
    );

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
 *
 * Updates:
 * - Personal information
 * - Church information
 * - Account role
 */
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      roleId,
      memberNumber,
      gender,
      dateOfBirth,
      baptismDate,
      address,
      status,
    } = req.body;

    /**
     * Validate role ID when provided
     *
     * 1 = Admin
     * 2 = Pastor
     * 3 = Church Elder
     * 4 = Ministry Leader
     * 5 = Member
     */
    if (
      roleId !== undefined &&
      (
        !Number.isInteger(Number(roleId)) ||
        Number(roleId) < 1 ||
        Number(roleId) > 5
      )
    ) {
      return errorResponse(
        res,
        "Role ID must be between 1 and 5",
        400
      );
    }

    /**
     * Validate gender when provided
     */
    if (
      gender !== undefined &&
      gender !== null &&
      gender !== "" &&
      gender !== "Male" &&
      gender !== "Female"
    ) {
      return errorResponse(
        res,
        "Gender must be either Male or Female",
        400
      );
    }

    /**
     * Validate status when provided
     */
    if (
      status !== undefined &&
      status !== null &&
      status !== "" &&
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
     * Validate first name
     */
    if (
      firstName !== undefined &&
      (
        typeof firstName !== "string" ||
        !firstName.trim()
      )
    ) {
      return errorResponse(
        res,
        "First name cannot be empty",
        400
      );
    }

    /**
     * Validate middle name
     *
     * Middle name is optional.
     */
    if (
      middleName !== undefined &&
      middleName !== null &&
      typeof middleName !== "string"
    ) {
      return errorResponse(
        res,
        "Middle name must be a string",
        400
      );
    }

    /**
     * Validate last name
     */
    if (
      lastName !== undefined &&
      (
        typeof lastName !== "string" ||
        !lastName.trim()
      )
    ) {
      return errorResponse(
        res,
        "Last name cannot be empty",
        400
      );
    }

    /**
     * Validate email
     */
    if (
      email !== undefined &&
      (
        typeof email !== "string" ||
        !email.trim()
      )
    ) {
      return errorResponse(
        res,
        "Email cannot be empty",
        400
      );
    }

    /**
     * Validate member number
     */
    if (
      memberNumber !== undefined &&
      (
        typeof memberNumber !== "string" ||
        !memberNumber.trim()
      )
    ) {
      return errorResponse(
        res,
        "Member number cannot be empty",
        400
      );
    }

    /**
     * Validate email format
     */
    if (
      email !== undefined &&
      email.trim()
    ) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        return errorResponse(
          res,
          "Please provide a valid email address",
          400
        );
      }
    }

    /**
     * Update member
     */
    await memberService.updateMember(
      id,
      {
        firstName:
          firstName !== undefined
            ? firstName.trim()
            : undefined,

        middleName:
          middleName !== undefined
            ? (
                middleName === null ||
                middleName === ""
                  ? null
                  : middleName.trim()
              )
            : undefined,

        lastName:
          lastName !== undefined
            ? lastName.trim()
            : undefined,

        email:
          email !== undefined
            ? email.trim()
            : undefined,

        phone:
          phone !== undefined
            ? phone
            : undefined,

        roleId:
          roleId !== undefined
            ? Number(roleId)
            : undefined,

        memberNumber:
          memberNumber !== undefined
            ? memberNumber.trim()
            : undefined,

        gender,

        dateOfBirth,

        baptismDate,

        address,

        status,
      }
    );

    /**
     * Return complete updated member
     */
    const updatedMember =
      await memberService.getMemberById(id);

    return successResponse(
      res,
      "Member updated successfully",
      updatedMember,
      200
    );
  } catch (error) {
    console.error(
      "Update member error:",
      error
    );

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
    console.error(
      "Delete member error:",
      error
    );

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
     * Validate role ID
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
     * Validate sort field
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
     * Validate sort order
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