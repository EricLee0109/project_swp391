import Statistics from "@/components/dashboard/components/statistics/Statistics";
import Header from "@/components/dashboard/header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" href="/" currentPage="Chi tiết" />
      <div className="p-5 flex-1 overflow-auto">
        <Statistics />
      </div>
    </div>
  );
}
