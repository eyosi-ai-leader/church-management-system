const { body } = require("express-validator");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email")
  .normalizeEmail();

const forgotPasswordValidator = [emailRule];

const resetPasswordValidator = [
  emailRule,

  body("code")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Enter the 6-digit code"),

  body("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

module.exports = {
  forgotPasswordValidator,
  resetPasswordValidator,
};