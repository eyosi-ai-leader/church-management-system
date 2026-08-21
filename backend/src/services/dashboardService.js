const dashboardModel = require("../models/dashboardModel");

async function getDashboardOverview(user) {
  return await dashboardModel.getDashboardOverview(user);
}

module.exports = {
  getDashboardOverview,
};