const { body } = require("express-validator");

const {
  PASSWORD_RULES_MESSAGE,
  isStrongPassword,
} = require("../utils/passwordPolicy");

const tokenRule = body("token")
  .isString()
  .withMessage("This invitation link is invalid or has expired.")
  .isLength({ min: 32, max: 128 })
  .withMessage("This invitation link is invalid or has expired.");

const checkInvitationValidator = [tokenRule];

const acceptInvitationValidator = [
  tokenRule,

  body("password").custom((value) => {
    if (!isStrongPassword(value)) {
      throw new Error(PASSWORD_RULES_MESSAGE);
    }

    return true;
  }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

module.exports = {
  checkInvitationValidator,
  acceptInvitationValidator,
};