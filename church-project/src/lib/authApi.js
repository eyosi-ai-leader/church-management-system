const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Unable to sign in."
    );
  }

  return result;
}

/**
 * Public member registration.
 *
 * FormData is required because
 * registration supports profile images.
 */
export async function registerUser(
  formData
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      body: formData,
    }
  );

  let result;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Unable to create your account."
    );
  }

  return result;
}