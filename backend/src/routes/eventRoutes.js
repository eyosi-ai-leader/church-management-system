const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { uploadProfileImage } = require("../middleware/uploadMiddleware");

const controller = require("../controllers/eventController");

const {
  idValidator,
  statusValidator,
  listValidator,
} = require("../validators/eventValidator");

const changeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `events-${req.user.id}`,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
});

// Everyone who is signed in can read the events they are allowed to see.
router.use(authMiddleware);

// Fixed paths first, then the ":id" routes.
router.get("/", listValidator, controller.list);

// Admin (1), Pastor (2) and Ministry Leader (4) can add and change events.
router.get("/options", roleMiddleware(1, 2, 4), controller.options);

router.post(
  "/",
  roleMiddleware(1, 2, 4),
  changeLimiter,
  uploadProfileImage.single("image"),
  controller.create
);

router.get("/:id", roleMiddleware(1, 2, 4), idValidator, controller.details);

router.put(
  "/:id",
  roleMiddleware(1, 2, 4),
  changeLimiter,
  uploadProfileImage.single("image"),
  idValidator,
  controller.update
);

router.patch(
  "/:id/status",
  roleMiddleware(1, 2, 4),
  changeLimiter,
  statusValidator,
  controller.changeStatus
);

router.delete(
  "/:id",
  roleMiddleware(1, 2, 4),
  changeLimiter,
  idValidator,
  controller.remove
);

module.exports = router;