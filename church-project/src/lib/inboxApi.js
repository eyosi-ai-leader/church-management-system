import { getToken } from "@/lib/authToken";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET" } = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
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

export const getBell = () => request("/inbox/bell");

export const listInbox = ({ filter = "all", page = 1 } = {}) =>
  request(`/inbox?filter=${filter}&page=${page}`);

export const getInboxItem = (id) => request(`/inbox/${id}`);

export const markInboxRead = (id) =>
  request(`/inbox/${id}/read`, { method: "POST" });

export const markAllInboxRead = () =>
  request("/inbox/read-all", { method: "POST" });

// Tells the bell (and anything else listening) to refresh its count.
export const notifyInboxChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("chms:inbox-updated"));
  }
};