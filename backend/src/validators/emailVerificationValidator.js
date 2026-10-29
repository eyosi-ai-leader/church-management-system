const { body } = require("express-validator");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email")
  .normalizeEmail();

const verifyEmailValidator = [
  emailRule,
  body("code")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Enter the 6-digit code"),
];

const resendVerificationValidator = [emailRule];

module.exports = {
  verifyEmailValidator,
  resendVerificationValidator,
};