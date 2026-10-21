
const churchAIModel = require("../models/churchAIModel");

const ALLOWED_ROLES = new Set([
  "Admin",
  "Pastor",
  "Church Elder",
  "Ministry Leader",
  "Member",
]);

async function getContext(question, authenticatedUser) {
  if (typeof question !== "string" || !question.trim()) {
    const error = new Error("A question is required.");
    error.statusCode = 400;
    throw error;
  }

  const userId = Number(
  authenticatedUser?.userId ??
  authenticatedUser?.user_id ??
  authenticatedUser?.id ??
  authenticatedUser?.sub
);

const roleId = Number(
  authenticatedUser?.roleId ??
  authenticatedUser?.role_id
);

  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error(
      "Your session does not contain a valid user ID."
    );
    error.statusCode = 401;
    throw error;
  }

  if (!Number.isInteger(roleId) || roleId <= 0) {
    const error = new Error(
      "Your session does not contain a valid role."
    );
    error.statusCode = 401;
    throw error;
  }

  const access = await churchAIModel.getUserAccess(userId, roleId);

  if (!access || !ALLOWED_ROLES.has(access.roleName)) {
    const error = new Error(
      "Your account or role is inactive or unavailable."
    );
    error.statusCode = 403;
    throw error;
  }

  const permissions = new Set(access.permissions);
  const isAdmin = access.roleName === "Admin";
  const isLeader = access.roleName === "Ministry Leader";
  const isMember = access.roleName === "Member";

  const canViewMembership =
    isAdmin || permissions.has("manage_members");

  const canViewMinistries =
    isAdmin ||
    permissions.has("manage_ministries") ||
    permissions.has("view_dashboard");

  const canViewRolePermissions =
    isAdmin || permissions.has("manage_roles");

  const text = question.trim().slice(0, 3000);
  const normalized = text.toLowerCase();

  const asksForRoster =
    /\b(roster|who belongs|list people|show.*members|members of|member list|leaders of)\b/i.test(
      text
    );

  const asksForTrends =
    /\b(trend|trends|growth|grew|increased|decreased|over time|history|historical|registration)\b/i.test(
      text
    );

  const asksForMembership =
    /\b(membership|members|registrations|inactive members|active members|total members)\b/i.test(
      text
    );

  const asksForRoles =
    /\b(roles|permissions|access control|who can access)\b/i.test(
      text
    );

  const asksForOwnProfile =
    /\b(my profile|my details|my membership|my ministries|about me|my record)\b/i.test(
      text
    );

  const asksForAdministration =
    /\b(administration|administrative|roles|permissions|access control)\b/i.test(
      text
    );

  const context = {
    source: "church_platform MySQL database",
    retrievedAt: new Date().toISOString(),
    currentUser: { role: access.roleName },
    accessScope: [],
  };

  if (canViewMembership && (asksForMembership || asksForTrends)) {
    context.membership =
      await churchAIModel.getMembershipOverview();

    context.accessScope.push("membership statistics");

    if (asksForTrends) {
      context.registrationHistory =
        await churchAIModel.getMemberRegistrationHistory();

      context.notes = [
        "Registration history counts member records created per month.",
        "Cumulative registrations are not historical active-member counts.",
      ];
    }
  } else if (asksForMembership && !canViewMembership) {
    context.membershipAccessDenied = true;
  }

  let ministries = [];

  if (canViewMinistries) {
    ministries = await churchAIModel.getMinistryOverview();
    context.ministries = ministries;
    context.accessScope.push("ministry overview");
  }

  let leaderMinistries = [];

  // SECURITY FIX 1:
  // Ministry Leaders may only select ministries assigned to them.
  let availableMinistries = ministries;

  if (isLeader) {
    leaderMinistries =
      await churchAIModel.getLeaderMinistries(userId);

    availableMinistries = leaderMinistries;
    context.ministries = leaderMinistries;
    context.accessScope = ["assigned ministries"];
  }

  if (isMember || asksForOwnProfile) {
    const ownRecord =
      await churchAIModel.getOwnMemberRecord(userId);

    const ownMinistries =
      await churchAIModel.getMemberMinistries(userId);

    context.ownRecord = ownRecord;
    context.ownMinistries = ownMinistries;

    context.accessScope.push("own member record and assignments");
  }

  // IMPORTANT: match against availableMinistries, not all ministries.
  const ministry = availableMinistries.find((item) =>
    normalized.includes(String(item.name).toLowerCase())
  );

  if (ministry) {
    context.selectedMinistry = ministry;
  }

  if (ministry && asksForRoster) {
    const canViewThisRoster =
      isAdmin ||
      permissions.has("manage_members") ||
      permissions.has("manage_ministries") ||
      (isLeader &&
        leaderMinistries.some(
          (item) => item.id === ministry.id
        ));

    if (canViewThisRoster) {
      context.roster =
        await churchAIModel.getMinistryRoster(ministry.id);

      context.accessScope.push("authorized ministry roster");
    } else {
      context.rosterAccessDenied = true;
    }
  }

  // SECURITY FIX 2:
  // Members cannot retrieve other people's ministry rosters.
  if (isMember && asksForRoster) {
    context.rosterAccessDenied = true;
  }

  if (ministry && asksForTrends && canViewMinistries) {
    context.assignmentHistory =
      await churchAIModel.getAssignmentHistory(ministry.id);

    context.notes = [
      ...(context.notes || []),
      "Assignment history counts assignment starts per month, not net membership growth.",
    ];
  }

  if (asksForAdministration || asksForRoles) {
    if (canViewRolePermissions) {
      context.rolePermissions =
        await churchAIModel.getRolePermissionOverview();

      context.accessScope.push("role and permission overview");
    } else {
      context.administrationAccessDenied = true;
    }
  }

  const note = context.membershipAccessDenied
    ? "The current role cannot access organization-wide membership reports."
    : context.administrationAccessDenied
      ? "The current role cannot access the complete role and permission matrix."
      : context.rosterAccessDenied
        ? "The requested roster is outside the current user's authorized scope."
        : null;

  return {
    question: text,
    context,
    note,
  };
}

module.exports = { getContext };
