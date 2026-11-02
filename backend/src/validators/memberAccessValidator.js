const { body, param, query } = require("express-validator");

const memberIdRule = param("memberId")
  .isInt({ min: 1 })
  .withMessage("Invalid member");

const listValidator = [
  query("filter")
    .optional({ values: "falsy" })
    .isIn(["never", "invited", "expired", "unverified", "signed_in", "all"])
    .withMessage("Invalid filter"),
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

const idValidator = [memberIdRule];

const statusValidator = [
  memberIdRule,
  body("status")
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

const bulkValidator = [
  body("memberIds")
    .isArray({ min: 1, max: 25 })
    .withMessage("Select between 1 and 25 members"),
  body("memberIds.*").isInt({ min: 1 }).withMessage("Invalid member"),
];

module.exports = {
  listValidator,
  idValidator,
  statusValidator,
  bulkValidator,
};