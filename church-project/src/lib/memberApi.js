const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/**
 * Get JWT token from browser cookie
 */
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

/**
 * Common API request helper
 *
 * Supports:
 * - JSON requests
 * - FormData requests
 */
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

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  /**
   * Do NOT manually set Content-Type
   * for FormData.
   *
   * The browser automatically sets:
   * multipart/form-data
   * with the required boundary.
   */
  if (!isFormData) {
    headers["Content-Type"] =
      "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
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
 * Get member by ID
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
 *
 * Supports FormData for profile image upload.
 */
export async function createMember(
  data
) {
  return request(
    `${API_URL}/members`,
    {
      method: "POST",
      body: data,
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
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data),
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