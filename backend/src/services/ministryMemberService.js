
const ministryMemberModel = require("../models/ministryMemberModel");

async function getMyMinistryMembers(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "Active",
    roleId = "",
    ministryId = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    const error = new Error("Page must be greater than or equal to 1.");
    error.statusCode = 400;
    throw error;
  }

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    const error = new Error("Limit must be between 1 and 100.");
    error.statusCode = 400;
    throw error;
  }

  if (status && !["Active", "Inactive"].includes(status)) {
    const error = new Error("Status must be Active or Inactive.");
    error.statusCode = 400;
    throw error;
  }

  if (
    roleId !== "" &&
    (!Number.isInteger(Number(roleId)) ||
      Number(roleId) < 1 ||
      Number(roleId) > 5)
  ) {
    const error = new Error("Role ID must be between 1 and 5.");
    error.statusCode = 400;
    throw error;
  }

  let parsedMinistryId = "";

  if (ministryId !== "" && ministryId !== null && ministryId !== undefined) {
    parsedMinistryId = Number(ministryId);

    if (
      !Number.isSafeInteger(parsedMinistryId) ||
      parsedMinistryId < 1
    ) {
      const error = new Error("Invalid ministry ID.");
      error.statusCode = 400;
      throw error;
    }
  }

  const result = await ministryMemberModel.getLeaderMembers(userId, {
    page: parsedPage,
    limit: parsedLimit,
    offset: (parsedPage - 1) * parsedLimit,
    search: String(search || "").trim(),
    status: status || "Active",
    roleId,
    ministryId: parsedMinistryId,
    sortBy,
    sortOrder,
  });

  return {
    members: result.members,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total: result.total,
      totalPages: Math.ceil(result.total / parsedLimit),
    },
  };
}

async function getMyMinistryMemberById(userId, memberId) {
  const parsedMemberId = Number(memberId);

  if (!Number.isSafeInteger(parsedMemberId) || parsedMemberId < 1) {
    const error = new Error("Invalid member ID.");
    error.statusCode = 400;
    throw error;
  }

  const member = await ministryMemberModel.getLeaderMemberById(
    userId,
    parsedMemberId
  );

  if (!member) {
    const error = new Error(
      "Member not found in your assigned ministry."
    );
    error.statusCode = 404;
    throw error;
  }

  return member;
}

async function updateMyMinistryMember(userId, memberId, input) {
  const parsedMemberId = Number(memberId);

  if (!Number.isSafeInteger(parsedMemberId) || parsedMemberId < 1) {
    const error = new Error("Invalid member ID.");
    error.statusCode = 400;
    throw error;
  }

  return ministryMemberModel.updateLeaderMember(
    userId,
    parsedMemberId,
    input
  );
}

module.exports = {
  getMyMinistryMembers,
  getMyMinistryMemberById,
  updateMyMinistryMember,
};
