import {
  Users,
  UserCheck,
  Church,
  CalendarDays,
} from "lucide-react";

import StatCard from "./StatCard";

const stats = [
  {
    title: "Total Members",
    value: "1,248",
    change: "12.4%",
    description: "vs. last month",
    icon: Users,
  },
  {
    title: "Active Members",
    value: "1,192",
    change: "8.2%",
    description: "vs. last month",
    icon: UserCheck,
  },
  {
    title: "Ministries",
    value: "18",
    change: "2.1%",
    description: "vs. last month",
    icon: Church,
  },
  {
    title: "Upcoming Events",
    value: "12",
    change: "5.4%",
    description: "vs. last month",
    icon: CalendarDays,
  },
];

export default function DashboardStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
        />
      ))}
    </section>
  );
}