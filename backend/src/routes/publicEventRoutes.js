const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const controller = require("../controllers/eventController");

const {
  publicListValidator,
  slugValidator,
} = require("../validators/eventValidator");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
});

// Open to everyone. Only public events are ever returned.
router.use(limiter);

router.get("/", publicListValidator, controller.publicList);
router.get("/featured", controller.publicFeatured);
router.get("/:slug", slugValidator, controller.publicDetail);

module.exports = router;