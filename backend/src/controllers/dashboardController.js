const dashboardService = require("../services/dashboardService");

async function getDashboardOverview(req, res, next) {
  try {
    const overview = await dashboardService.getDashboardOverview();

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardOverview,
};