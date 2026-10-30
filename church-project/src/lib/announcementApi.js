import { getToken } from "@/lib/authToken";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
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

export const getAudienceOptions = () => request("/announcements/options");

export const searchMembers = ({ search = "", ministryId = "", page = 1 } = {}) => {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (ministryId) params.set("ministryId", String(ministryId));
  params.set("page", String(page));

  return request(`/announcements/members?${params.toString()}`);
};

export const previewAudience = (audience) =>
  request("/announcements/preview", { method: "POST", body: { audience } });

export const sendTestAnnouncement = ({ subject, message }) =>
  request("/announcements/test", {
    method: "POST",
    body: { subject, message },
  });

export const createAnnouncement = ({ subject, message, audience }) =>
  request("/announcements", {
    method: "POST",
    body: { subject, message, audience },
  });

export const listAnnouncements = () => request("/announcements");

export const getAnnouncementDetails = (id) =>
  request(`/announcements/${id}`);

export const retryAnnouncement = (id) =>
  request(`/announcements/${id}/retry`, { method: "POST" });

export const retryRecipient = (id, recipientId) =>
  request(`/announcements/${id}/recipients/${recipientId}/retry`, {
    method: "POST",
  });