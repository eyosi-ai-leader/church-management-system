export function getMemberName(person = {}) {
  const parts = [
    person.first_name || person.firstName,
    person.middle_name || person.middleName,
    person.last_name || person.lastName,
  ].filter(Boolean);

  return (
    parts.join(" ") ||
    person.full_name ||
    person.name ||
    person.email ||
    "Unnamed member"
  );
}

export function getMemberEmail(person = {}) {
  return (
    person.email ||
    person.email_address ||
    person.user_email ||
    "No email"
  );
}

export function getAssignmentMemberId(person = {}) {
  return (
    person.member_id ??
    person.memberId ??
    person.church_member_id ??
    person.churchMemberId ??
    person.id
  );
}

export function getMemberNumber(person = {}) {
  return person.member_number || person.memberNumber || "—";
}

export function normalizeList(response) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.members)) return data.members;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}