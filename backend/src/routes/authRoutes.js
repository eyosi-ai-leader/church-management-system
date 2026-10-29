const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  resendVerification,
} = require("../controllers/authController");

const {
  uploadProfileImage,
} = require("../middleware/uploadMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const {
  verifyEmailValidator,
  resendVerificationValidator,
} = require("../validators/emailVerificationValidator");

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

const verifyLimiter = limiter(15 * 60 * 1000, 10);
const resendLimiter = limiter(60 * 60 * 1000, 5);

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Profile accessed",
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware(1),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

router.post(
  "/register",
  uploadProfileImage.single("profileImage"),
  registerValidator,
  register
);

router.post(
  "/login",
  loginValidator,
  login
);

router.post(
  "/verify-email",
  verifyLimiter,
  verifyEmailValidator,
  verifyEmail
);

router.post(
  "/resend-verification",
  resendLimiter,
  resendVerificationValidator,
  resendVerification
);

module.exports = router;