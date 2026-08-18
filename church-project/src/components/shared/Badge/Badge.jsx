import clsx from "clsx";

const variants = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-surface-muted text-body",
  success: "bg-success/10 text-success",
  warning: "bg-accent/20 text-ink",
  danger: "bg-danger/10 text-danger",
};

export default function Badge({ children, variant = "primary", className = "" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}