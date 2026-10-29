const { body } = require("express-validator");

const profileValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters"),

  body("middleName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Middle name must not exceed 100 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Last name must be between 2 and 100 characters"),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^[+\d\s()-]{5,30}$/)
    .withMessage("Enter a valid phone number"),

  body("gender")
    .optional({ values: "falsy" })
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("dateOfBirth")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date of birth cannot be in the future");
      }

      return true;
    }),

  body("address")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must not exceed 500 characters"),
];

module.exports = {
  profileValidator,
};