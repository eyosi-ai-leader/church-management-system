const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

const {
  uploadProfileImage,
} = require("../middleware/uploadMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

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

module.exports = router;