const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const controller = require("../controllers/announcementController");

const {
  previewValidator,
  testValidator,
  createAnnouncementValidator,
  retryValidator,
  detailsValidator,
  retryRecipientValidator,
  membersQueryValidator,
  listQueryValidator,
} = require("../validators/announcementValidator");

const perUserLimiter = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user-${req.user.id}`,
    handler: (req, res) =>
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      }),
  });

const previewLimiter = perUserLimiter(15 * 60 * 1000, 120);
const browseLimiter = perUserLimiter(15 * 60 * 1000, 300);
const testLimiter = perUserLimiter(60 * 60 * 1000, 10);
const createLimiter = perUserLimiter(60 * 60 * 1000, 10);
const retryLimiter = perUserLimiter(60 * 60 * 1000, 30);
const deleteLimiter = perUserLimiter(60 * 60 * 1000, 60);

// Admin (1), Pastor (2) and Ministry Leader (4) only.
router.use(authMiddleware, roleMiddleware(1, 2, 4));

// Fixed paths first, then the ":id" routes.
router.get("/options", controller.getOptions);
router.get("/members", browseLimiter, membersQueryValidator, controller.searchMembers);
router.get("/", listQueryValidator, controller.list);

router.post("/preview", previewLimiter, previewValidator, controller.preview);
router.post("/test", testLimiter, testValidator, controller.sendTest);
router.post("/", createLimiter, createAnnouncementValidator, controller.create);

router.get("/:id", detailsValidator, controller.details);
router.delete("/:id", deleteLimiter, detailsValidator, controller.remove);
router.post("/:id/retry", retryLimiter, retryValidator, controller.retry);
router.post(
  "/:id/recipients/:recipientId/retry",
  retryLimiter,
  retryRecipientValidator,
  controller.retryRecipient
);

module.exports = router;