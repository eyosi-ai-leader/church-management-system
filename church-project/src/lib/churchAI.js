
export async function sendChurchAIMessage(messages) {
  const response = await fetch("/api/church-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ messages }),
    cache: "no-store",
  });

 const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  throw new Error(
    `Church AI returned a non-JSON response (HTTP ${response.status}). Check the API route.`
  );
}

const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Unable to contact Church AI."
    );
  }

  return result;
}
