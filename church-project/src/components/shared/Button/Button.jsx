import Link from "next/link";
import clsx from "clsx";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-dark",
  secondary:
    "border border-line text-ink hover:border-primary hover:text-primary",
  ghost:
    "text-ink hover:bg-surface-muted",
};

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className
  );

  if (href && !disabled) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}