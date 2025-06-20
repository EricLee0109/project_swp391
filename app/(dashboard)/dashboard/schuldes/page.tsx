import Calendar from "@/components/dashboard/components/schedule-dashboard/Calendar";
import CreateSchedule from "@/components/dashboard/components/schedule-dashboard/CreateSchedule";
import DashboardSchedules from "@/components/dashboard/components/schedule-dashboard/Schedule";
import Header from "@/components/dashboard/header";

export default function SchuldesPage() {
  return (
    <div>
      <Header
        title="Đặt lịch"
        href="/dashboard/schuldes"
        currentPage="Đặt lịch tư vấn có khách hàng"
      />
      <div className="container mx-auto p-6">
        <div className="flex justify-end">
          <CreateSchedule />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 ">
            <DashboardSchedules />
          </div>
          <div className="w-full md:w-[300px] shrink-0 ">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
