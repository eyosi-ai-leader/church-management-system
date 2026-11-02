const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const service = require("../services/invitationService");

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

    console.error("Invitation error:", error.message);

    return errorResponse(
      res,
      "Something went wrong. Please try again shortly.",
      500
    );
  }
};

const check = handle(async (req, res) => {
  const data = await service.checkInvitation(req.body.token);
  return successResponse(res, "Invitation is valid.", data);
});

const accept = handle(async (req, res) => {
  const data = await service.acceptInvitation(
    req.body.token,
    req.body.password
  );

  return successResponse(res, "Your password has been set.", data);
});

module.exports = {
  check,
  accept,
};