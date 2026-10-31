const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const service = require("../services/inboxService");

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

    console.error("Inbox error:", error.message);

    return errorResponse(
      res,
      "Something went wrong. Please try again shortly.",
      500
    );
  }
};

const bell = handle(async (req, res) => {
  const data = await service.getBell(req.user);
  return successResponse(res, "Notifications retrieved", data);
});

const list = handle(async (req, res) => {
  const data = await service.listInbox(req.user, {
    filter: req.query.filter,
    page: req.query.page,
  });

  return successResponse(res, "Inbox retrieved", data);
});

const item = handle(async (req, res) => {
  const data = await service.getItem(req.user, Number(req.params.id));
  return successResponse(res, "Announcement retrieved", data);
});

const markRead = handle(async (req, res) => {
  await service.markRead(req.user, Number(req.params.id));
  return successResponse(res, "Marked as read.", null);
});

const markAllRead = handle(async (req, res) => {
  await service.markAllRead(req.user);
  return successResponse(res, "All marked as read.", null);
});

module.exports = {
  bell,
  list,
  item,
  markRead,
  markAllRead,
};