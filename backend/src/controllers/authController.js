const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const {
  registerUser,
  loginUser,
} = require("../services/authService");

const {
  verifyEmailCode,
  resendVerificationCode,
} = require("../services/emailVerificationService");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        "Validation failed",
        400,
        errors.array()
      );
    }

    const result =
      await registerUser(
        req.body,
        req.file || null
      );

    return successResponse(
      res,
      result.message,
      result.user
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

const login = async (req, res) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        "Validation failed",
        400,
        errors.array()
      );
    }

    const result =
      await loginUser(req.body);

    return successResponse(
      res,
      result.message,
      {
        user: result.user,
        token: result.token,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

const verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        errors.array()[0].msg,
        400,
        errors.array()
      );
    }

    const result = await verifyEmailCode(
      req.body.email,
      req.body.code
    );

    return successResponse(
      res,
      result.alreadyVerified
        ? "Email already verified."
        : "Email verified successfully.",
      null
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

const resendVerification = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        errors.array()[0].msg,
        400,
        errors.array()
      );
    }

    await resendVerificationCode(req.body.email);

    return successResponse(
      res,
      "If this account needs verification, a new code has been sent.",
      null
    );
  } catch (error) {
    // Do not leak internal email/SMTP errors to visitors.
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }

    console.error("Resend verification failed:", error.message);

    return errorResponse(
      res,
      "We couldn't send the code. Please try again shortly.",
      500
    );
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
};