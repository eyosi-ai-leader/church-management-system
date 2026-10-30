const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const {
  getAnnouncementPreference,
  setAnnouncementPreference,
} = require("../models/preferencesModel");

const getPreferences = async (req, res) => {
  try {
    const enabled = await getAnnouncementPreference(req.user.id);

    if (enabled === null) {
      return errorResponse(res, "Account not found.", 404);
    }

    return successResponse(res, "Preferences retrieved", {
      announcementEmails: enabled,
    });
  } catch (error) {
    console.error("Get preferences failed:", error.message);
    return errorResponse(res, "We couldn't load your preferences.", 500);
  }
};

const updatePreferences = async (req, res) => {
  const value = req.body?.announcementEmails;

  if (typeof value !== "boolean") {
    return errorResponse(res, "Invalid preference value.", 400);
  }

  try {
    await setAnnouncementPreference(req.user.id, value);

    return successResponse(res, "Preferences saved", {
      announcementEmails: value,
    });
  } catch (error) {
    console.error("Update preferences failed:", error.message);
    return errorResponse(res, "We couldn't save your preference.", 500);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
};