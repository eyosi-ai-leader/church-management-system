
"use client";

import { useEffect, useState } from "react";
import MinistryOverview from "@/components/dashboard/ministries/MinistryOverview";
import MinistryLeaderOverview from "@/components/dashboard/ministries/MinistryLeaderOverview";

export default function MinistriesPage() {
  const [roleId, setRoleId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setRoleId(Number(JSON.parse(storedUser)?.roleId));
      }
    } catch (error) {
      console.error("Could not read logged-in user:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return <div className="p-8 text-sm text-slate-500">Loading...</div>;
  }

  return roleId === 4
    ? <MinistryLeaderOverview />
    : <MinistryOverview />;
}
