export function saveSession({ token, user, rememberMe = false }) {
  const maxAge = rememberMe ? " max-age=2592000;" : "";
  const secure = window.location.protocol === "https:" ? " Secure;" : "";

  document.cookie = `token=${token}; path=/;${maxAge} SameSite=Lax;${secure}`;
  localStorage.setItem("user", JSON.stringify(user));
}