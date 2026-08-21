const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware(1, 2, 3),
  dashboardController.getDashboardOverview
);

module.exports = router;