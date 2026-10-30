import { getToken } from "@/lib/authToken";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(method, body) {
  const token = getToken();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/profile/preferences`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "We couldn't reach the server. Check your connection and try again."
    );
  }

  let result = {};

  try {
    result = await response.json();
  } catch {
    /* non-JSON response */
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong. Please try again."
    );
  }

  return result.data;
}

export const getPreferences = () => request("GET");

export const updatePreferences = (preferences) =>
  request("PUT", preferences);