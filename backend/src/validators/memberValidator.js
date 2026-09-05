const { body, param } = require("express-validator");

/**
 * Validate member ID
 */
const memberIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage(
      "Member ID must be a positive integer"
    ),
];

/**
 * Validate create member request
 *
 * Member number is intentionally NOT included.
 * It is generated automatically by the backend.
 */
const createMemberValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(
      "First name is required"
    )
    .isLength({ max: 100 })
    .withMessage(
      "First name must not exceed 100 characters"
    ),

  body("middleName")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Middle name must not exceed 100 characters"
    ),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(
      "Last name is required"
    )
    .isLength({ max: 100 })
    .withMessage(
      "Last name must not exceed 100 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required"
    )
    .isEmail()
    .withMessage(
      "Please provide a valid email address"
    )
    .isLength({ max: 255 })
    .withMessage(
      "Email must not exceed 255 characters"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    )
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "Phone must not exceed 20 characters"
    ),

  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage(
      "Address must not exceed 255 characters"
    ),

  body("roleId")
    .isInt({ min: 1, max: 5 })
    .withMessage(
      "Role ID must be between 1 and 5"
    ),

  body("gender")
    .optional({ nullable: true })
    .isIn(["Male", "Female"])
    .withMessage(
      "Gender must be Male or Female"
    ),

  body("dateOfBirth")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage(
      "Date of birth must be a valid date"
    ),

  body("baptismDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage(
      "Baptism date must be a valid date"
    ),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage(
      "Status must be Active or Inactive"
    ),
];

/**
 * Validate update member request
 *
 * Member number is intentionally NOT included.
 * It cannot be changed after creation.
 */
const updateMemberValidator = [
  ...memberIdValidator,

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "First name cannot be empty"
    )
    .isLength({ max: 100 })
    .withMessage(
      "First name must not exceed 100 characters"
    ),

  body("middleName")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Middle name must not exceed 100 characters"
    ),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Last name cannot be empty"
    )
    .isLength({ max: 100 })
    .withMessage(
      "Last name must not exceed 100 characters"
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage(
      "Please provide a valid email address"
    )
    .isLength({ max: 255 })
    .withMessage(
      "Email must not exceed 255 characters"
    ),

  body("roleId")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage(
      "Role ID must be between 1 and 5"
    ),

  body("gender")
    .optional({ nullable: true })
    .isIn(["Male", "Female"])
    .withMessage(
      "Gender must be Male or Female"
    ),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "Phone must not exceed 20 characters"
    ),

  body("dateOfBirth")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage(
      "Date of birth must be a valid date"
    ),

  body("baptismDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage(
      "Baptism date must be a valid date"
    ),

  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage(
      "Address must not exceed 255 characters"
    ),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage(
      "Status must be Active or Inactive"
    ),
];

module.exports = {
  memberIdValidator,
  createMemberValidator,
  updateMemberValidator,
};