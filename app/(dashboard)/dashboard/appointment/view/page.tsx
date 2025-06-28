import AppointmentListingPage from "@/components/dashboard/components/appointment/appointment-list/AppointmentsListingPage";
import Header from "@/components/dashboard/header";

const AppointmentsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách các cuộc hẹn" />
      <div className="p-5 flex-1 overflow-auto">
        <AppointmentListingPage />
      </div>
    </div>
  );
};

export default AppointmentsPage;
