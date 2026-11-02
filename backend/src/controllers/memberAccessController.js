const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const service = require("../services/memberAccessService");

const handle = (action) => async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, errors.array());
  }

  try {
    return await action(req, res);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }

    console.error("Member access error:", error.message);

    return errorResponse(
      res,
      "Something went wrong. Please try again shortly.",
      500
    );
  }
};

const list = handle(async (req, res) => {
  const data = await service.list(req.user, {
    filter: req.query.filter,
    search: req.query.search,
    page: req.query.page,
  });

  return successResponse(res, "Member access retrieved", data);
});

const exportRows = handle(async (req, res) => {
  const data = await service.exportRows(req.user, {
    filter: req.query.filter,
    search: req.query.search,
  });

  return successResponse(res, "Export ready", data);
});

const invite = handle(async (req, res) => {
  await service.sendInvite(req.user, Number(req.params.memberId));
  return successResponse(res, "Invitation sent.", null);
});

const inviteBulk = handle(async (req, res) => {
  const data = await service.sendInvites(req.user, req.body.memberIds);
  return successResponse(res, "Invitations processed.", data);
});

const setStatus = handle(async (req, res) => {
  await service.setStatus(
    req.user,
    Number(req.params.memberId),
    req.body.status
  );

  return successResponse(res, "Member status updated.", null);
});

const remove = handle(async (req, res) => {
  await service.removeAccount(req.user, Number(req.params.memberId));
  return successResponse(res, "Member deleted.", null);
});

module.exports = {
  list,
  exportRows,
  invite,
  inviteBulk,
  setStatus,
  remove,
};