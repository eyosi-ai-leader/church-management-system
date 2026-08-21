const dashboardModel = require("../models/dashboardModel");

async function getDashboardOverview() {
  return await dashboardModel.getDashboardOverview();
}

module.exports = {
  getDashboardOverview,
};