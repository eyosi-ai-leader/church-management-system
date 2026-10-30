const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const service = require("../services/announcementService");

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

    console.error("Announcement error:", error.message);

    return errorResponse(
      res,
      "Something went wrong. Please try again shortly.",
      500
    );
  }
};

const getOptions = handle(async (req, res) => {
  const data = await service.getAudienceOptions(req.user);
  return successResponse(res, "Audience options retrieved", data);
});

const searchMembers = handle(async (req, res) => {
  const data = await service.searchMembers(req.user, {
    search: req.query.search,
    ministryId: req.query.ministryId,
    page: req.query.page,
  });

  return successResponse(res, "Members retrieved", data);
});

const preview = handle(async (req, res) => {
  const data = await service.previewAudience(req.user, req.body.audience);
  return successResponse(res, "Audience previewed", data);
});

const sendTest = handle(async (req, res) => {
  await service.sendTest(req.user, req.body);
  return successResponse(res, "Test email sent to your address.", null);
});

const create = handle(async (req, res) => {
  const data = await service.createAnnouncement(req.user, req.body);

  return successResponse(
    res,
    "Your announcement is being sent.",
    data,
    202
  );
});

const list = handle(async (req, res) => {
  const data = await service.listAnnouncements(req.user);
  return successResponse(res, "Announcements retrieved", data);
});

const details = handle(async (req, res) => {
  const data = await service.getAnnouncementDetails(
    req.user,
    Number(req.params.id)
  );

  return successResponse(res, "Announcement retrieved", data);
});

const retry = handle(async (req, res) => {
  await service.retryAnnouncement(req.user, Number(req.params.id));
  return successResponse(res, "Retrying unsent emails.", null, 202);
});

const retryRecipient = handle(async (req, res) => {
  await service.retryRecipient(
    req.user,
    Number(req.params.id),
    Number(req.params.recipientId)
  );

  return successResponse(res, "Retrying this email.", null, 202);
});

module.exports = {
  getOptions,
  searchMembers,
  preview,
  sendTest,
  create,
  list,
  details,
  retry,
  retryRecipient,
};