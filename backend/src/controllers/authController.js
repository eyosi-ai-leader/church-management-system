const { validationResult } = require("express-validator");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const {
  registerUser,
  loginUser,
} = require("../services/authService");

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

module.exports = {
  register,
  login,
};