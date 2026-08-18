"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavItem = ({ href, label, onClick }) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "relative rounded-full px-3.5 py-2 text-sm transition-all duration-300 ease-out",
        isActive
          ? "font-medium text-ink"
          : "text-body hover:bg-surface-muted hover:text-ink"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
      )}
    </Link>
  );
};

export default NavItem;