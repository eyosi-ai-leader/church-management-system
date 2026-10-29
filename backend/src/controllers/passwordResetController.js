const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const {
  requestPasswordReset,
  resetPassword,
} = require("../services/passwordResetService");

const forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, errors.array());
  }

  try {
    await requestPasswordReset(req.body.email);
  } catch (error) {
    // Never reveal internal errors or whether the account exists.
    console.error("Forgot password failed:", error.message);
  }

  return successResponse(
    res,
    "If an account exists for this email, a 6-digit code has been sent.",
    null
  );
};

const resetPasswordHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, errors.array());
  }

  try {
    await resetPassword(
      req.body.email,
      req.body.code,
      req.body.password
    );

    return successResponse(
      res,
      "Your password has been reset. You can now sign in.",
      null
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }

    console.error("Reset password failed:", error.message);

    return errorResponse(
      res,
      "We couldn't reset your password. Please try again shortly.",
      500
    );
  }
};

module.exports = {
  forgotPassword,
  resetPassword: resetPasswordHandler,
};