export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateStoredUser(patch) {
  if (typeof window === "undefined") return;

  const current = getStoredUser();

  if (!current) return;

  localStorage.setItem("user", JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new Event("chms:user-updated"));
}