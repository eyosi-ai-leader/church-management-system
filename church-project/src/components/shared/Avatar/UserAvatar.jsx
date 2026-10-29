export default function UserAvatar({ user, className = "h-10 w-10 text-xs" }) {
  const first = user?.firstName?.trim() || "";
  const last = user?.lastName?.trim() || "";

  const initials =
    first && last
      ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
      : (first.charAt(0) || "?").toUpperCase();

  if (user?.profileImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.profileImage}
        alt=""
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-sm`}
    >
      {initials}
    </div>
  );
}