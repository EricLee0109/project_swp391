import HealthServiceListingPage from "@/components/dashboard/components/healthServices/healthService-list/HealthServiceListing";
import Header from "@/components/dashboard/header";

const HealthServicesPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách các cuộc hẹn" />
      <div className="p-5 flex-1 overflow-auto">
        <HealthServiceListingPage />
      </div>
    </div>
  );
};

export default HealthServicesPage;
