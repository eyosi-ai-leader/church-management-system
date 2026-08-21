import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="ml-64 min-h-screen">
        <DashboardHeader />

        <main className="min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}