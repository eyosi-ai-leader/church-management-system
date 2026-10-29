const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function post(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

  return result;
}

export const requestPasswordReset = (email) =>
  post("/auth/forgot-password", { email });

export const resetPassword = ({ email, code, password, confirmPassword }) =>
  post("/auth/reset-password", { email, code, password, confirmPassword });