const { body } = require("express-validator");

const registerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "First name must be between 2 and 100 characters"
    ),

  body("middleName")
    .optional({
      values: "falsy",
    })
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Middle name must not exceed 100 characters"
    ),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Last name must be between 2 and 100 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Please provide a valid email"
    )
    .normalizeEmail(),

  body("phone")
    .optional({
      values: "falsy",
    })
    .trim()
    .isLength({
      max: 30,
    })
    .withMessage(
      "Phone number must not exceed 30 characters"
    ),

  body("gender")
    .optional({
      values: "falsy",
    })
    .trim()
    .isIn(["Male", "Female"])
    .withMessage(
      "Gender must be Male or Female"
    ),

  body("dateOfBirth")
    .optional({
      values: "falsy",
    })
    .trim()
    .isISO8601()
    .withMessage(
      "Date of birth must be a valid date"
    ),

  body("baptismDate")
    .optional({
      values: "falsy",
    })
    .trim()
    .isISO8601()
    .withMessage(
      "Baptism date must be a valid date"
    ),

  body("address")
    .optional({
      values: "falsy",
    })
    .trim()
    .isLength({
      max: 500,
    })
    .withMessage(
      "Address must not exceed 500 characters"
    ),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 8,
    })
    .withMessage(
      "Password must be at least 8 characters"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage(
      "Confirm password is required"
    )
    .custom(
      (value, { req }) => {
        if (
          value !== req.body.password
        ) {
          throw new Error(
            "Passwords do not match"
          );
        }

        return true;
      }
    ),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Please provide a valid email"
    )
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
};