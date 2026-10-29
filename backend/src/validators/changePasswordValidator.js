const { body } = require("express-validator");

const {
  PASSWORD_RULES_MESSAGE,
  isStrongPassword,
} = require("../utils/passwordPolicy");

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .custom((value) => {
      if (!isStrongPassword(value)) {
        throw new Error(PASSWORD_RULES_MESSAGE);
      }

      return true;
    })
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error(
          "New password must be different from your current password"
        );
      }

      return true;
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

module.exports = {
  changePasswordValidator,
};