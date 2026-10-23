
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="));

  return cookie
    ? decodeURIComponent(cookie.substring("token=".length))
    : null;
}

async function request(url, options = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

export async function getMinistries({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);

  const query = params.toString();

  return request(
    `${API_URL}/ministries${query ? `?${query}` : ""}`
  );
}

export async function getMinistryById(id) {
  return request(`${API_URL}/ministries/${encodeURIComponent(id)}`);
}

export async function createMinistry(data) {
  return request(`${API_URL}/ministries`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMinistry(id, data) {
  return request(`${API_URL}/ministries/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateMinistryStatus(id, status) {
  return request(`${API_URL}/ministries/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getMinistryMembers(id, role = "") {
  const params = new URLSearchParams();

  if (role) params.set("role", role);

  const query = params.toString();

  return request(
    `${API_URL}/ministries/${encodeURIComponent(id)}/members${
      query ? `?${query}` : ""
    }`
  );
}

export async function getMyMinistries() {
  return request(`${API_URL}/ministries/my-ministries`);
}

export async function assignMinistryMember(
  ministryId,
  { memberId, assignmentRole = "Member" }
) {
  return request(
    `${API_URL}/ministries/${encodeURIComponent(ministryId)}/members`,
    {
      method: "POST",
      body: JSON.stringify({ memberId, assignmentRole }),
    }
  );
}

export async function removeMinistryMember(ministryId, memberId) {
  return request(
    `${API_URL}/ministries/${encodeURIComponent(ministryId)}/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE" }
  );
}

export async function moveMinistryMember(ministryId, memberId, toMinistryId) {
  return request(
    `${API_URL}/ministries/${encodeURIComponent(ministryId)}/members/${encodeURIComponent(memberId)}/move`,
    {
      method: "POST",
      body: JSON.stringify({ toMinistryId }),
    }
  );
}
