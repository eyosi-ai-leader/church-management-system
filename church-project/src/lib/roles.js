export const ROLES = {
  ADMIN: 1,
  PASTOR: 2,
  CHURCH_ELDER: 3,
  MINISTRY_LEADER: 4,
  MEMBER: 5,
};

export const ROLE_NAMES = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.PASTOR]: "Pastor",
  [ROLES.CHURCH_ELDER]: "Church Elder",
  [ROLES.MINISTRY_LEADER]: "Ministry Leader",
  [ROLES.MEMBER]: "Member",
};

export function getRoleName(roleId) {
  return ROLE_NAMES[Number(roleId)] || "Member";
}

export function isAdmin(roleId) {
  return Number(roleId) === ROLES.ADMIN;
}

export function isPastor(roleId) {
  return Number(roleId) === ROLES.PASTOR;
}

export function isChurchElder(roleId) {
  return Number(roleId) === ROLES.CHURCH_ELDER;
}

export function isMinistryLeader(roleId) {
  return Number(roleId) === ROLES.MINISTRY_LEADER;
}

export function isMember(roleId) {
  return Number(roleId) === ROLES.MEMBER;
}

export function canManageMembers(roleId) {
  const role = Number(roleId);

  return (
    role === ROLES.ADMIN ||
    role === ROLES.PASTOR
  );
}

export function canViewMembers(roleId) {
  const role = Number(roleId);

  return (
    role === ROLES.ADMIN ||
    role === ROLES.PASTOR ||
    role === ROLES.CHURCH_ELDER
  );
}