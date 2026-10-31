const { body, param, query } = require("express-validator");

const DELIVERY_VALUES = ["both", "dashboard", "email"];

const audienceRule = body("audience")
  .isObject()
  .withMessage("Choose who should receive this announcement.");

const deliveryRule = body("delivery")
  .optional()
  .isIn(DELIVERY_VALUES)
  .withMessage("Choose how to deliver this announcement.");

const subjectRule = body("subject")
  .trim()
  .notEmpty()
  .withMessage("Subject is required")
  .isLength({ max: 150 })
  .withMessage("Subject must not exceed 150 characters");

const messageRule = body("message")
  .trim()
  .notEmpty()
  .withMessage("Message is required")
  .isLength({ min: 10, max: 5000 })
  .withMessage("Message must be between 10 and 5000 characters");

const idRule = param("id").isInt({ min: 1 }).withMessage("Invalid announcement");

const previewValidator = [audienceRule, deliveryRule];
const testValidator = [subjectRule, messageRule];
const createAnnouncementValidator = [
  subjectRule,
  messageRule,
  audienceRule,
  deliveryRule,
];

const retryValidator = [idRule];
const detailsValidator = [idRule];

const retryRecipientValidator = [
  idRule,
  param("recipientId").isInt({ min: 1 }).withMessage("Invalid recipient"),
];

const membersQueryValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search is too long"),
  query("ministryId")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Invalid ministry"),
  query("page")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1000 })
    .withMessage("Invalid page"),
  query("delivery")
    .optional({ values: "falsy" })
    .isIn(DELIVERY_VALUES)
    .withMessage("Invalid delivery"),
];

const listQueryValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search is too long"),
  query("page")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 10000 })
    .withMessage("Invalid page"),
];

module.exports = {
  previewValidator,
  testValidator,
  createAnnouncementValidator,
  retryValidator,
  detailsValidator,
  retryRecipientValidator,
  membersQueryValidator,
  listQueryValidator,
};