const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const service = require("../services/eventService");

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

    console.error("Event error:", error.message);

    return errorResponse(
      res,
      "Something went wrong. Please try again shortly.",
      500
    );
  }
};

/* ---- Public website (no sign-in) ---- */

const publicList = handle(async (req, res) => {
  const data = await service.listPublic({ limit: req.query.limit });

  res.set("Cache-Control", "public, max-age=30");

  return successResponse(res, "Events retrieved", data);
});

const publicFeatured = handle(async (req, res) => {
  const data = await service.getPublicFeatured();

  res.set("Cache-Control", "public, max-age=30");

  return successResponse(res, "Featured event retrieved", data);
});

const publicDetail = handle(async (req, res) => {
  const data = await service.getPublicBySlug(req.params.slug);

  res.set("Cache-Control", "public, max-age=30");

  return successResponse(res, "Event retrieved", data);
});

/* ---- Dashboard (signed in) ---- */

const list = handle(async (req, res) => {
  const data = await service.listForUser(req.user, {
    scope: req.query.scope,
    search: req.query.search,
    page: req.query.page,
  });

  return successResponse(res, "Events retrieved", data);
});

const options = handle(async (req, res) => {
  const data = await service.getOptions(req.user);
  return successResponse(res, "Event options retrieved", data);
});

const details = handle(async (req, res) => {
  const data = await service.getForEdit(req.user, Number(req.params.id));
  return successResponse(res, "Event retrieved", data);
});

const create = handle(async (req, res) => {
  const data = await service.createEvent(req.user, req.body || {}, req.file);
  return successResponse(res, "Event created.", data, 201);
});

const update = handle(async (req, res) => {
  const data = await service.updateEvent(
    req.user,
    Number(req.params.id),
    req.body || {},
    req.file
  );

  return successResponse(res, "Event updated.", data);
});

const changeStatus = handle(async (req, res) => {
  await service.changeStatus(
    req.user,
    Number(req.params.id),
    req.body.status
  );

  return successResponse(res, "Event status updated.", null);
});

const remove = handle(async (req, res) => {
  await service.deleteEvent(req.user, Number(req.params.id));
  return successResponse(res, "Event deleted.", null);
});

module.exports = {
  publicList,
  publicFeatured,
  publicDetail,
  list,
  options,
  details,
  create,
  update,
  changeStatus,
  remove,
};