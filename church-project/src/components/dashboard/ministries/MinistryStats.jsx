import { Building2, Users, UserRound, Archive } from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total ministries",
    icon: Building2,
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "active",
    label: "Active ministries",
    icon: Users,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "members",
    label: "Ministry memberships",
    icon: UserRound,
    color: "bg-violet-50 text-violet-700",
  },
  {
    key: "inactive",
    label: "Inactive ministries",
    icon: Archive,
    color: "bg-amber-50 text-amber-700",
  },
];

export default function MinistryStats({ ministries = [] }) {
  const stats = {
    total: ministries.length,
    active: ministries.filter((item) => item.status === "Active").length,
    inactive: ministries.filter((item) => item.status === "Inactive").length,
    members: ministries.reduce(
      (sum, item) => sum + Number(item.member_count || 0),
      0
    ),
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <span className={`rounded-xl p-2.5 ${color}`}>
              <Icon size={20} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {stats[key].toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
