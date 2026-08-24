const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

function getAuthToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies =
    document.cookie.split("; ");

  const tokenCookie = cookies.find(
    (cookie) =>
      cookie.startsWith("token=")
  );

  return tokenCookie
    ? decodeURIComponent(
        tokenCookie.split("=")[1]
      )
    : null;
}

async function request(
  url,
  options = {}
) {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication token not found"
    );
  }

  const response = await fetch(url, {
    ...options,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "application/json",
      ...(options.headers || {}),
    },

    cache: "no-store",
  });

  const result =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Something went wrong. Please try again."
    );
  }

  return result;
}

/**
 * Get all members
 *
 * Supports:
 * - pagination
 * - search
 * - status
 * - role
 * - sorting
 *
 * Role IDs:
 *
 * 1 = Admin
 * 2 = Pastor
 * 3 = Church Elder
 * 4 = Ministry Leader
 * 5 = Member
 */
export async function getMembers({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  roleId = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = {}) {
  const params =
    new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);

  if (search.trim()) {
    params.set(
      "search",
      search.trim()
    );
  }

  if (status) {
    params.set("status", status);
  }

  if (roleId) {
    params.set("roleId", roleId);
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (sortOrder) {
    params.set(
      "sortOrder",
      sortOrder
    );
  }

  return request(
    `${API_URL}/members?${params.toString()}`
  );
}

/**
 * Get single member
 */
export async function getMemberById(
  id
) {
  return request(
    `${API_URL}/members/${id}`
  );
}

/**
 * Create member
 */
export async function createMember(
  data
) {
  return request(
    `${API_URL}/members`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Update member
 */
export async function updateMember(
  id,
  data
) {
  return request(
    `${API_URL}/members/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Delete member
 */
export async function deleteMember(
  id
) {
  return request(
    `${API_URL}/members/${id}`,
    {
      method: "DELETE",
    }
  );
}