import DashboardWelcome from "./DashboardWelcome";
import DashboardStats from "./DashboardStats";
import MemberGrowth from "./MemberGrowth";
import RecentActivity from "./RecentActivity";
import AIInsight from "./AIInsight";

export default function DashboardOverview({ currentDate }) {
  return (
    <div className="space-y-6">
      <DashboardWelcome currentDate={currentDate} />

      <DashboardStats />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <MemberGrowth />
        <RecentActivity />
      </section>

      <AIInsight />
    </div>
  );
}