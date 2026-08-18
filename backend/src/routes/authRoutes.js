const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    res.json({
      success: true,
      message: "Profile accessed",
      user: req.user
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
      user: req.user
    });

  }
);

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

module.exports = router;

