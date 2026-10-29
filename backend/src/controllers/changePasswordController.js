const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const { changePassword } = require("../services/changePasswordService");

const changePasswordHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, errors.array());
  }

  try {
    await changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    return successResponse(res, "Your password has been changed.", null);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }

    console.error("Change password failed:", error.message);

    return errorResponse(
      res,
      "We couldn't change your password. Please try again shortly.",
      500
    );
  }
};

module.exports = {
  changePassword: changePasswordHandler,
};