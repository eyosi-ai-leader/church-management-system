export function getToken() {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}