const { body, param } = require("express-validator");

/**
 * Validate member ID
 */
const memberIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Member ID must be a positive integer"),
];

/**
 * Validate member creation
 */
const createMemberValidator = [
  body("userId")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),

  body("memberNumber")
    .trim()
    .notEmpty()
    .withMessage("Member number is required")
    .isLength({ max: 30 })
    .withMessage("Member number must not exceed 30 characters"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone must not exceed 20 characters"),

  body("dateOfBirth")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("baptismDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Baptism date must be a valid date"),

  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),
];

/**
 * Validate member update
 */
const updateMemberValidator = [
  ...memberIdValidator,

  body("memberNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Member number cannot be empty")
    .isLength({ max: 30 })
    .withMessage("Member number must not exceed 30 characters"),

  body("gender")
    .optional()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone must not exceed 20 characters"),

  body("dateOfBirth")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("baptismDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Baptism date must be a valid date"),

  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

module.exports = {
  memberIdValidator,
  createMemberValidator,
  updateMemberValidator,
};