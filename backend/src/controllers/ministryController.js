
const ministryService = require("../services/ministryService");

const sendError = (res, error) => {
  console.error("Ministry API error:", error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "A ministry with this name already exists.",
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Ministry operation failed.",
  });
};

const list = async (req, res) => {
  try {
    const data = await ministryService.listMinistries({
      search: String(req.query.search || "").trim(),
      status: String(req.query.status || "").trim(),
    });

    return res.json({
      success: true,
      message: "Ministries retrieved successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    const data = await ministryService.getMinistry(req.params.id);
    return res.json({ success: true, data });
  } catch (error) {
    return sendError(res, error);
  }
};

const create = async (req, res) => {
  try {
    const data = await ministryService.createMinistry(req.body);
    return res.status(201).json({
      success: true,
      message: "Ministry created successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const data = await ministryService.updateMinistry(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Ministry updated successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const data = await ministryService.updateStatus(
      req.params.id,
      req.body.status
    );

    return res.json({
      success: true,
      message: "Ministry status updated successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getMembers = async (req, res) => {
  try {
    const data = await ministryService.getMembers(
      req.params.id,
      String(req.query.role || "")
    );

    return res.json({
      success: true,
      message: "Ministry assignments retrieved successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const assignMember = async (req, res) => {
  try {
    const data = await ministryService.assignMember(
      req.params.id,
      req.body.memberId,
      req.body.assignmentRole || "Member"
    );

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const removeAssignment = async (req, res) => {
  try {
    const data = await ministryService.removeAssignment(
      req.params.id,
      req.params.memberId
    );

    return res.json({
      success: true,
      message: "Ministry assignment ended successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const moveMember = async (req, res) => {
  try {
    const data = await ministryService.moveMember(
      req.params.id,
      req.body.toMinistryId,
      req.params.memberId
    );

    return res.json({
      success: true,
      message: "Member moved successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  getMembers,
  assignMember,
  removeAssignment,
  moveMember,
};
