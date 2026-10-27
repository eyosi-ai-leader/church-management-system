const express = require("express");
const rateLimit = require("express-rate-limit");
const { createPrayerRequest } = require("../controllers/prayerRequestController");

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
});

router.post("/", submitLimiter, createPrayerRequest);

module.exports = router;