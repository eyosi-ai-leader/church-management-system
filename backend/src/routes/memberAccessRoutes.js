const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const controller = require("../controllers/memberAccessController");

const {
  listValidator,
  idValidator,
  statusValidator,
  bulkValidator,
} = require("../validators/memberAccessValidator");

const perUserLimiter = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `access-${req.user.id}`,
    handler: (req, res) =>
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      }),
  });

const readLimiter = perUserLimiter(15 * 60 * 1000, 300);
const inviteLimiter = perUserLimiter(60 * 60 * 1000, 60);
const bulkLimiter = perUserLimiter(60 * 60 * 1000, 10);
const changeLimiter = perUserLimiter(60 * 60 * 1000, 120);

// Admin (1) and Pastor (2) only.
router.use(authMiddleware, roleMiddleware(1, 2));

// Fixed paths first, then the ":memberId" routes.
router.get("/", readLimiter, listValidator, controller.list);
router.get("/export", readLimiter, listValidator, controller.exportRows);
router.post("/invite-bulk", bulkLimiter, bulkValidator, controller.inviteBulk);

router.post("/:memberId/invite", inviteLimiter, idValidator, controller.invite);
router.patch(
  "/:memberId/status",
  changeLimiter,
  statusValidator,
  controller.setStatus
);
router.delete("/:memberId", changeLimiter, idValidator, controller.remove);

module.exports = router;