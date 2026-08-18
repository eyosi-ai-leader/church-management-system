"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Logo from "./logo";
import DesktopNav from "./desktopnav";
import MobileNav from "./mobile-navbar";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-muted px-4 pt-4 lg:px-6">
      <div
        className={clsx(
          "mx-auto flex w-full max-w-7xl items-center justify-between rounded-full bg-surface px-5 shadow-card ring-1 ring-line transition-all duration-300",
          scrolled ? "py-2 shadow-soft" : "py-2.5"
        )}
      >
        <Logo />
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
};

export default Navbar;