const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/uploadMiddleware");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const { profileValidator } = require("../validators/profileValidator");

router.use(authMiddleware);

router.get("/me", getMyProfile);

router.put(
  "/me",
  uploadProfileImage.single("profileImage"),
  profileValidator,
  updateMyProfile
);

module.exports = router;