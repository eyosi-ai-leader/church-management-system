import { getToken } from "@/lib/authToken";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      cache: "no-store",
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

export const listEvents = ({ scope = "upcoming", search = "", page = 1 } = {}) => {
  const params = new URLSearchParams();

  params.set("scope", scope);
  if (search) params.set("search", search);
  params.set("page", String(page));

  return request(`/events?${params.toString()}`);
};

export const getEventOptions = () => request("/events/options");

export const getEventForEdit = (id) => request(`/events/${id}`);

export const createEvent = (formData) =>
  request("/events", { method: "POST", body: formData });

export const updateEvent = (id, formData) =>
  request(`/events/${id}`, { method: "PUT", body: formData });

export const setEventStatus = (id, status) =>
  request(`/events/${id}/status`, { method: "PATCH", body: { status } });

export const deleteEvent = (id) =>
  request(`/events/${id}`, { method: "DELETE" });