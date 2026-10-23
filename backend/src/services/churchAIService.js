
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

  // Always use the database as the source of truth for access.
  const access = await churchAIModel.getUserAccess(
    userId,
    roleId
  );

  if (!access || !ALLOWED_ROLES.has(access.roleName)) {
    const error = new Error(
      "Your account or role is inactive or unavailable."
    );
    error.statusCode = 403;
    throw error;
  }

  const permissions = new Set(access.permissions || []);

  const isAdmin = access.roleName === "Admin";
  const isPastor = access.roleName === "Pastor";
  const isElder = access.roleName === "Church Elder";
  const isLeader = access.roleName === "Ministry Leader";
  const isMember = access.roleName === "Member";

  const canViewMembership =
    isAdmin || permissions.has("manage_members");

  const canViewMinistries =
    isAdmin ||
    permissions.has("manage_ministries") ||
    (!isLeader && permissions.has("view_dashboard"));

  const canViewRolePermissions =
    isAdmin || permissions.has("manage_roles");

  const text = question.trim().slice(0, 3000);
  const normalized = text.toLowerCase();

  /*
   * Recognize questions asking for ministry leaders.
   */
  const asksForLeaders =
    /\b(leader|leaders|leadership|who leads|who is leading|headed by|head of|ministry leader)\b/i.test(
      text
    );

  /*
   * Recognize roster and member-detail questions, including:
   * "What about the minister member of this children ministry?"
   * "Tell me about the members of Children Ministry."
   * "Show each member's email and phone number."
   */
  const asksForRoster =
    /\b(roster|who belongs|list people|show.*members?|members?\s+of|member\s+of|member\s+list|list.*members?|who are the members|member details|members?' details|member information|members' information|contact details|phone numbers|email addresses|member profiles|all members|every member|minister members?|ministry members?|tell me about.*members?|what about.*members?|what about.*minister)\b/i.test(
      text
    );

  const asksForTrends =
    /\b(trend|trends|growth|grew|increased|decreased|over time|history|historical|registration|registrations|monthly|updated|update history)\b/i.test(
      text
    );

  const asksForMembership =
    /\b(membership|members|registrations|inactive members|active members|total members|member count)\b/i.test(
      text
    );

  const asksForMinistryDetails =
    /\b(ministry|ministries|description|meeting|created|registered|status|assignment)\b/i.test(
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

  /*
   * Context instructions for the AI.
   *
   * The frontend AI API route must also pass these instructions
   * to the model. Retrieving data here alone does not guarantee
   * that the AI will display all fields in its final response.
   */
  const rosterResponseInstructions = [
    "When answering a ministry roster question, use the supplied context.roster records.",
    "Do not answer with names alone when detailed roster records are available.",
    "Include every returned roster person relevant to the question.",
    "For each person, provide full name, actual assignment role, email, phone, age, membership status, member-since date, and ministry assignment date when those fields are available.",
    "Keep ministry leaders and ordinary ministry members distinct using the actual assignmentRole field.",
    "Do not call an ordinary member a ministry leader unless the database assignmentRole identifies that person as a leader.",
    "If a requested field is null or missing, write 'Not recorded'. Do not invent information.",
    "Explain that memberSince refers to the person's membership record date, while assignedAt refers to the ministry assignment date.",
    "Never reveal a full date of birth, passwords, password hashes, authentication tokens, or identity numbers.",
    "Use the rosterSummary counts only as supplementary information; use the actual roster records to identify people.",
  ];

  const context = {
    source: "church_platform MySQL database",
    retrievedAt: new Date().toISOString(),

    currentUser: {
      role: access.roleName,
    },

    accessScope: [],

    privacyNote:
      "Do not expose passwords, password hashes, authentication tokens, identity numbers, private credentials, or full dates of birth. Age is calculated from date of birth when available. If a field is null or missing, say it is not recorded.",

    rosterResponseInstructions,
  };

  /*
   * Membership statistics and registration history.
   */
  if (canViewMembership && (asksForMembership || asksForTrends)) {
    context.membership =
      await churchAIModel.getMembershipOverview();

    context.accessScope.push(
      "organization-wide membership statistics"
    );

    if (asksForTrends) {
      context.registrationHistory =
        await churchAIModel.getMemberRegistrationHistory();

      context.notes = [
        "Registration history counts member records created per month.",
        "Cumulative registrations are not historical active-member counts.",
        "Member updatedAt is shown only when the database contains an updated_at field; this is not a complete change audit trail.",
      ];
    }
  } else if (asksForMembership && !canViewMembership) {
    context.membershipAccessDenied = true;
  }

  /*
   * Load ministry information allowed for this role.
   */
  let availableMinistries = [];

  if (canViewMinistries) {
    availableMinistries =
      await churchAIModel.getMinistryOverview();

    context.ministries = availableMinistries;

    context.accessScope.push(
      "ministry overview and available ministry details"
    );
  }

  /*
   * Ministry Leaders can access only their assigned ministries.
   * Replace any organization-wide ministry list with their own.
   */
  let leaderMinistries = [];

  if (isLeader) {
    leaderMinistries =
      await churchAIModel.getLeaderMinistries(userId);

    availableMinistries = leaderMinistries;
    context.ministries = leaderMinistries;

    context.accessScope = ["assigned ministries only"];
  }

  /*
   * Members may access their own profile and assignments,
   * but not another person's profile or ministry roster.
   */
  if (isMember || asksForOwnProfile) {
    context.ownRecord =
      await churchAIModel.getOwnMemberRecord(userId);

    context.ownMinistries =
      await churchAIModel.getMemberMinistries(userId);

    context.accessScope.push(
      "own member profile and assignments"
    );
  }

  /*
   * Identify the ministry referenced in the question.
   * Prefer the longest matching ministry name to avoid a shorter
   * ministry name being selected when names overlap.
   */
  const ministry = availableMinistries
    .filter(
      (item) =>
        item?.name &&
        normalized.includes(String(item.name).toLowerCase())
    )
    .sort(
      (a, b) =>
        String(b.name).length - String(a.name).length
    )[0];

  if (ministry) {
    context.selectedMinistry = ministry;
  }

  if (
    asksForMinistryDetails &&
    !ministry &&
    canViewMinistries
  ) {
    context.allMinistriesAvailable = true;
  }

  /*
   * Ministry leader profiles.
   */
  if (asksForLeaders) {
    const canViewLeaders =
      isAdmin ||
      permissions.has("manage_members") ||
      permissions.has("manage_ministries") ||
      (
        isLeader &&
        ministry &&
        leaderMinistries.some(
          (item) => Number(item.id) === Number(ministry.id)
        )
      );

    if (canViewLeaders) {
      if (ministry) {
        const leaders =
          await churchAIModel.getMinistryLeaders(ministry.id);

        context.ministryLeaders = leaders.map((leader) => ({
          ministryName: ministry.name,
          ...leader,
        }));
      } else {
        const leadersByMinistry = await Promise.all(
          availableMinistries.map(async (item) => {
            const leaders =
              await churchAIModel.getMinistryLeaders(item.id);

            return leaders.map((leader) => ({
              ministryName: item.name,
              ...leader,
            }));
          })
        );

        context.ministryLeaders = leadersByMinistry.flat();
      }

      context.accessScope.push(
        "authorized ministry leader profiles"
      );

      if (!context.ministryLeaders.length) {
        context.noActiveMinistryLeadersFound = true;
      }
    } else {
      context.leaderAccessDenied = true;
    }
  }

  /*
   * Retrieve the full ministry roster when authorized.
   *
   * Admins and roles with manage_members or manage_ministries
   * can retrieve ministry rosters.
   *
   * Ministry Leaders can retrieve rosters only for their own
   * assigned ministries.
   */
  if (ministry && asksForRoster) {
    const canViewThisRoster =
      isAdmin ||
      permissions.has("manage_members") ||
      permissions.has("manage_ministries") ||
      (
        isLeader &&
        leaderMinistries.some(
          (item) => Number(item.id) === Number(ministry.id)
        )
      );

    if (canViewThisRoster) {
      const roster = await churchAIModel.getMinistryRoster(
        ministry.id
      );

      context.roster = roster;

      const roleCounts = roster.reduce(
        (counts, person) => {
          const assignmentRole = String(
            person.assignmentRole || ""
          ).trim().toLowerCase();

          if (assignmentRole === "ministry leader") {
            counts.leaders += 1;
          } else if (assignmentRole === "member") {
            counts.members += 1;
          } else {
            counts.otherAssignments += 1;
          }

          return counts;
        },
        {
          leaders: 0,
          members: 0,
          otherAssignments: 0,
        }
      );

      context.rosterSummary = {
        ministryName: ministry.name,
        totalPeople: roster.length,
        ordinaryMembers: roleCounts.members,
        ministryLeaders: roleCounts.leaders,
        otherAssignments: roleCounts.otherAssignments,
      };

      context.rosterResponseInstructions =
        rosterResponseInstructions;

      context.accessScope.push(
        "authorized ministry member contact/profile details"
      );

      if (roster.length === 0) {
        context.noActiveMinistryMembersFound = true;
      }
    } else {
      context.rosterAccessDenied = true;
    }
  } else if (asksForRoster && !ministry) {
    context.rosterRequestNeedsMinistry = true;
  }

  /*
   * Explicit restriction for ordinary Members.
   * Do not return another person's roster, even if another
   * condition accidentally populated it.
   */
  if (isMember && asksForRoster) {
    delete context.roster;
    delete context.rosterSummary;

    context.rosterAccessDenied = true;
  }

  /*
   * Ministry assignment trends.
   */
  if (ministry && asksForTrends && canViewMinistries) {
    context.assignmentHistory =
      await churchAIModel.getAssignmentHistory(ministry.id);

    context.notes = [
      ...(context.notes || []),
      "Assignment history counts assignment starts per month, not net membership growth.",
    ];
  }

  /*
   * Role and permission information.
   */
  if (asksForAdministration || asksForRoles) {
    if (canViewRolePermissions) {
      context.rolePermissions =
        await churchAIModel.getRolePermissionOverview();

      context.accessScope.push(
        "role and permission overview"
      );
    } else {
      context.administrationAccessDenied = true;
    }
  }

  /*
   * Explain access limitations to the AI.
   */
  let note = null;

  if (context.membershipAccessDenied) {
    note =
      "The current role cannot access organization-wide membership reports.";
  } else if (context.administrationAccessDenied) {
    note =
      "The current role cannot access the complete role and permission matrix.";
  } else if (context.rosterAccessDenied) {
    note =
      "The requested roster is outside the current user's authorized scope. Do not reveal roster records.";
  } else if (context.leaderAccessDenied) {
    note =
      "The current role cannot access the requested ministry leader information.";
  } else if (context.rosterRequestNeedsMinistry) {
    note =
      "Ask which ministry the user wants member details for.";
  } else if (context.noActiveMinistryLeadersFound) {
    note =
      "No ministry leaders were returned for the requested ministry or authorized scope. Do not invent a name.";
  } else if (context.noActiveMinistryMembersFound) {
    note =
      "No ministry roster records were returned for the selected ministry. Do not invent members.";
  }

  return {
    question: text,
    context,
    note,
  };
}

module.exports = { getContext };
