const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    throw new Error(result.message || "Something went wrong. Please try again.");
  }

  return result;
}

export const verifyEmailCode = (email, code) =>
  post("/auth/verify-email", { email, code });

export const resendVerificationCode = (email) =>
  post("/auth/resend-verification", { email });