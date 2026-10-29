const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function readJson(response, fallbackMessage) {
  try {
    return await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }
}

export async function loginUser(email, password) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch {
    throw new Error(
      "We couldn't reach the server. Check your connection and try again."
    );
  }

  const result = await readJson(
    response,
    "The server returned an invalid response."
  );

  if (!response.ok) {
    throw new Error(result.message || "Unable to sign in.");
  }

  return result;
}

/**
 * Public member registration.
 *
 * FormData is required because
 * registration supports profile images.
 */
export async function registerUser(formData) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "We couldn't reach the server. Check your connection and try again."
    );
  }

  const result = await readJson(
    response,
    "The server returned an invalid response."
  );

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to create your account."
    );
  }

  return result;
}