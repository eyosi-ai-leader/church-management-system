const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("token=")
  );

  return tokenCookie
    ? decodeURIComponent(tokenCookie.split("=")[1])
    : null;
}

export async function getDashboardOverview() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${API_URL}/dashboard/overview`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to load dashboard overview"
    );
  }

  return response.json();
}