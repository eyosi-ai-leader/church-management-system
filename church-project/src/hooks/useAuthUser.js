"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function useAuthUser() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setUser(null);
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [pathname]);

  const logout = useCallback(() => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/");
  }, [router]);

  return { user, logout };
}