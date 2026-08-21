const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

/*
 * Dashboard
 * All authenticated users can access the dashboard.
 */
router.get(
  "/overview",
  authMiddleware,
  dashboardController.getDashboardOverview
);

module.exports = router;