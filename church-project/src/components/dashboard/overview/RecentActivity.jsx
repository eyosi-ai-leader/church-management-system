import {
  Users,
  UserPlus,
  Church,
  CalendarPlus,
} from "lucide-react";

const activities = [
  {
    title: "New member registered",
    description: "A new member joined the church",
    time: "12 minutes ago",
    icon: UserPlus,
  },
  {
    title: "Member profile updated",
    description: "Member information was updated",
    time: "42 minutes ago",
    icon: Users,
  },
  {
    title: "Ministry activity added",
    description: "New ministry activity was recorded",
    time: "2 hours ago",
    icon: Church,
  },
  {
    title: "Upcoming event created",
    description: "A new church event was scheduled",
    time: "4 hours ago",
    icon: CalendarPlus,
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Recent Activity
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Church Activity
          </h2>
        </div>

        <button className="text-xs font-semibold text-slate-500 transition hover:text-slate-900">
          View all
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Icon size={16} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {activity.description}
                </p>

                <p className="mt-1 text-[11px] text-slate-300">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}