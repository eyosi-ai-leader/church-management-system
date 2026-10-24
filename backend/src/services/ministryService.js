
const db = require("../config/db");
const ministryModel = require("../models/ministryModel");

const httpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateId = (value, label = "ID") => {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    throw httpError(`${label} must be a positive integer.`);
  }

  return id;
};

const listMinistries = async ({ search = "", status = "" } = {}) => {
  if (status && !["Active", "Inactive"].includes(status)) {
    throw httpError("Status must be Active or Inactive.");
  }

  return ministryModel.listMinistries({ search, status });
};

const getMinistry = async (id) => {
  id = validateId(id, "Ministry ID");

  const ministry = await ministryModel.getMinistryById(id);

  if (!ministry) {
    throw httpError("Ministry not found.", 404);
  }

  return ministry;
};

const createMinistry = async ({ name, description, imageUrl }) => {
  if (typeof name !== "string" || !name.trim()) {
    throw httpError("Ministry name is required.");
  }

  if (name.trim().length > 100) {
    throw httpError("Ministry name cannot exceed 100 characters.");
  }

  return ministryModel.createMinistry({
    name: name.trim(),
    description: typeof description === "string" ? description.trim() : "",
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
  });
};

const updateMinistry = async (id, { name, description, imageUrl }) => {
  id = validateId(id, "Ministry ID");
  await getMinistry(id);

  if (typeof name !== "string" || !name.trim()) {
    throw httpError("Ministry name is required.");
  }

  if (name.trim().length > 100) {
    throw httpError("Ministry name cannot exceed 100 characters.");
  }

  return ministryModel.updateMinistry(id, {
    name: name.trim(),
    description: typeof description === "string" ? description.trim() : "",
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
  });
};

const updateStatus = async (id, status) => {
  id = validateId(id, "Ministry ID");
  await getMinistry(id);

  if (!["Active", "Inactive"].includes(status)) {
    throw httpError("Status must be Active or Inactive.");
  }

  return ministryModel.updateMinistryStatus(id, status);
};

const getMembers = async (id, role = "") => {
  id = validateId(id, "Ministry ID");
  await getMinistry(id);

  if (role && !["Member", "Ministry Leader"].includes(role)) {
    throw httpError("Invalid assignment role.");
  }

  // Preserve existing behavior: return active assignments by default.
  return ministryModel.getMinistryMembers(id, role);
};

const assignMember = async (
  ministryId,
  memberId,
  assignmentRole = "Member"
) => {
  ministryId = validateId(ministryId, "Ministry ID");
  memberId = validateId(memberId, "Member ID");

  if (!["Member", "Ministry Leader"].includes(assignmentRole)) {
    throw httpError("Assignment role must be Member or Ministry Leader.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [ministries] = await connection.execute(
      "SELECT id, status FROM ministries WHERE id = ? FOR UPDATE",
      [ministryId]
    );

    if (!ministries[0]) {
      throw httpError("Ministry not found.", 404);
    }

    if (ministries[0].status !== "Active") {
      throw httpError("Cannot assign people to an inactive ministry.");
    }

    const member = await ministryModel.getEligibleMember(
      memberId,
      connection
    );

    if (!member) {
      throw httpError("Active church member not found.", 404);
    }

    await connection.execute(
      "SELECT id FROM members WHERE id = ? FOR UPDATE",
      [memberId]
    );

    const [existing] = await connection.execute(
      `SELECT id, status
       FROM ministry_members
       WHERE ministry_id = ? AND member_id = ?
       ORDER BY id DESC
       LIMIT 1
       FOR UPDATE`,
      [ministryId, memberId]
    );

    if (existing[0]?.status === "Active") {
      throw httpError("This person is already assigned to this ministry.");
    }

    if (existing[0]) {
      await connection.execute(
        `UPDATE ministry_members
         SET assignment_role = ?, status = 'Active',
             assigned_at = CURRENT_TIMESTAMP, ended_at = NULL
         WHERE id = ?`,
        [assignmentRole, existing[0].id]
      );
    } else {
      await connection.execute(
        `INSERT INTO ministry_members
           (ministry_id, member_id, assignment_role, status)
         VALUES (?, ?, ?, 'Active')`,
        [ministryId, memberId, assignmentRole]
      );
    }

    await connection.commit();

    return { ministryId, memberId, assignmentRole };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const removeAssignment = async (ministryId, memberId) => {
  ministryId = validateId(ministryId, "Ministry ID");
  memberId = validateId(memberId, "Member ID");

  const [result] = await db.execute(
    `UPDATE ministry_members
     SET status = 'Inactive', ended_at = CURRENT_TIMESTAMP
     WHERE ministry_id = ? AND member_id = ? AND status = 'Active'`,
    [ministryId, memberId]
  );

  if (!result.affectedRows) {
    throw httpError("Active ministry assignment not found.", 404);
  }

  return { ministryId, memberId };
};

const moveMember = async (fromMinistryId, toMinistryId, memberId) => {
  fromMinistryId = validateId(fromMinistryId, "Source ministry ID");
  toMinistryId = validateId(toMinistryId, "Target ministry ID");
  memberId = validateId(memberId, "Member ID");

  if (fromMinistryId === toMinistryId) {
    throw httpError("Source and target ministries must be different.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [memberRows] = await connection.execute(
      "SELECT id, status FROM members WHERE id = ? FOR UPDATE",
      [memberId]
    );

    if (!memberRows[0] || memberRows[0].status !== "Active") {
      throw httpError("Active church member not found.", 404);
    }

    const [ministries] = await connection.execute(
      `SELECT id, status FROM ministries
       WHERE id IN (?, ?) ORDER BY id FOR UPDATE`,
      [fromMinistryId, toMinistryId]
    );

    const source = ministries.find((item) => item.id === fromMinistryId);
    const target = ministries.find((item) => item.id === toMinistryId);

    if (!source || !target) {
      throw httpError("Ministry not found.", 404);
    }

    if (target.status !== "Active") {
      throw httpError("Cannot move a member to an inactive ministry.");
    }

    const [sourceRows] = await connection.execute(
      `SELECT id, assignment_role FROM ministry_members
       WHERE ministry_id = ? AND member_id = ? AND status = 'Active'
       LIMIT 1 FOR UPDATE`,
      [fromMinistryId, memberId]
    );

    if (!sourceRows[0]) {
      throw httpError("Active source assignment not found.", 404);
    }

    if (sourceRows[0].assignment_role === "Ministry Leader") {
      throw httpError(
        "End or change the leadership assignment separately before moving this person."
      );
    }

    const [targetRows] = await connection.execute(
      `SELECT id, status FROM ministry_members
       WHERE ministry_id = ? AND member_id = ?
       ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [toMinistryId, memberId]
    );

    if (targetRows[0]?.status === "Active") {
      throw httpError("This person is already assigned to the target ministry.");
    }

    await connection.execute(
      `UPDATE ministry_members
       SET status = 'Inactive', ended_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [sourceRows[0].id]
    );

    if (targetRows[0]) {
      await connection.execute(
        `UPDATE ministry_members
         SET assignment_role = 'Member', status = 'Active',
             assigned_at = CURRENT_TIMESTAMP, ended_at = NULL
         WHERE id = ?`,
        [targetRows[0].id]
      );
    } else {
      await connection.execute(
        `INSERT INTO ministry_members
           (ministry_id, member_id, assignment_role, status)
         VALUES (?, ?, 'Member', 'Active')`,
        [toMinistryId, memberId]
      );
    }

    await connection.commit();

    return { memberId, fromMinistryId, toMinistryId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getLeaderMinistries = async (userId) => {
  userId = validateId(userId, "User ID");
  return ministryModel.getLeaderMinistries(userId);
};

// Authorization helper for every Ministry Leader-only operation.
const assertLeaderAccess = async (userId, ministryId) => {
  userId = validateId(userId, "User ID");
  ministryId = validateId(ministryId, "Ministry ID");

  const isLeader = await ministryModel.isLeaderOfMinistry(
    userId,
    ministryId
  );

  if (!isLeader) {
    throw httpError(
      "You are not authorized to manage this ministry.",
      403
    );
  }

  return { userId, ministryId };
};

const getLeaderMembers = async (ministryId, userId, status = "Active") => {
  const access = await assertLeaderAccess(userId, ministryId);

  if (!["Active", "Inactive", "All"].includes(status)) {
    throw httpError("Status must be Active, Inactive, or All.");
  }

  return ministryModel.getMinistryMembers(
    access.ministryId,
    "",
    status
  );
};

const updateLeaderMinistry = async (
  ministryId,
  userId,
  { name, description }
) => {
  const access = await assertLeaderAccess(userId, ministryId);

  if (typeof name !== "string" || !name.trim()) {
    throw httpError("Ministry name is required.");
  }

  if (name.trim().length > 100) {
    throw httpError("Ministry name cannot exceed 100 characters.");
  }

  return ministryModel.updateLeaderMinistry(access.ministryId, {
    name: name.trim(),
    description:
      typeof description === "string" ? description.trim() : "",
  });
};

const assignLeaderMember = async (ministryId, userId, memberId) => {
  const access = await assertLeaderAccess(userId, ministryId);

  // Leaders can assign existing members, but cannot appoint other leaders.
  return assignMember(access.ministryId, memberId, "Member");
};

const removeLeaderAssignment = async (ministryId, userId, memberId) => {
  const access = await assertLeaderAccess(userId, ministryId);
  memberId = validateId(memberId, "Member ID");

  const assignment = await ministryModel.getMinistryAssignment(
    access.ministryId,
    memberId
  );

  if (!assignment || assignment.status !== "Active") {
    throw httpError("Active ministry assignment not found.", 404);
  }

  if (assignment.assignment_role !== "Member") {
    throw httpError(
      "Ministry Leaders cannot remove another person's leadership assignment.",
      403
    );
  }

  return removeAssignment(access.ministryId, memberId);
};

const updateLeaderAssignmentStatus = async (
  ministryId,
  userId,
  memberId,
  status
) => {
  const access = await assertLeaderAccess(userId, ministryId);
  memberId = validateId(memberId, "Member ID");

  if (!["Active", "Inactive"].includes(status)) {
    throw httpError("Status must be Active or Inactive.");
  }

  const assignment = await ministryModel.getMinistryAssignment(
    access.ministryId,
    memberId
  );

  if (!assignment) {
    throw httpError("Ministry assignment not found.", 404);
  }

  if (assignment.assignment_role !== "Member") {
    throw httpError(
      "Ministry Leaders cannot change another person's leadership assignment.",
      403
    );
  }

  if (assignment.status === status) {
    throw httpError(`This assignment is already ${status.toLowerCase()}.`);
  }

  if (status === "Active") {
    // Existing assignMember logic checks the ministry and member eligibility,
    // then safely reactivates the previous assignment.
    return assignMember(access.ministryId, memberId, "Member");
  }

  return removeAssignment(access.ministryId, memberId);
};

module.exports = {
  listMinistries,
  getMinistry,
  createMinistry,
  updateMinistry,
  updateStatus,
  getMembers,
  assignMember,
  removeAssignment,
  moveMember,
  getLeaderMinistries,
  getLeaderMembers,
  updateLeaderMinistry,
  assignLeaderMember,
  removeLeaderAssignment,
  updateLeaderAssignmentStatus,
};
