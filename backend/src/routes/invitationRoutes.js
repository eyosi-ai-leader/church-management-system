const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const controller = require("../controllers/invitationController");

const {
  checkInvitationValidator,
  acceptInvitationValidator,
} = require("../validators/invitationValidator");

const limiter = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      }),
  });

const checkLimiter = limiter(15 * 60 * 1000, 60);
const acceptLimiter = limiter(15 * 60 * 1000, 15);

router.post("/check", checkLimiter, checkInvitationValidator, controller.check);
router.post(
  "/accept",
  acceptLimiter,
  acceptInvitationValidator,
  controller.accept
);

module.exports = router;