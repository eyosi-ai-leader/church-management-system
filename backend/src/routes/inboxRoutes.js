const express = require("express");
const rateLimit = require("express-rate-limit");
const { param, query } = require("express-validator");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/inboxController");

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `inbox-${req.user.id}`,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
});

const idValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid announcement"),
];

const listValidator = [
  query("filter")
    .optional({ values: "falsy" })
    .isIn(["all", "unread"])
    .withMessage("Invalid filter"),
  query("page")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 10000 })
    .withMessage("Invalid page"),
];

// Every signed-in role can read their own announcements.
router.use(authMiddleware, readLimiter);

// Fixed paths first, then the ":id" routes.
router.get("/bell", controller.bell);
router.get("/", listValidator, controller.list);
router.post("/read-all", controller.markAllRead);
router.get("/:id", idValidator, controller.item);
router.post("/:id/read", idValidator, controller.markRead);

module.exports = router;