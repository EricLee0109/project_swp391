
// import ConsultantListingPage from "@/components/dashboard/components/consultant/consultant-listing/ConsultantListingPage";
import Header from "@/components/dashboard/header";


const ConsultantDashboard = () => {
  
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách tư vấn viên" />
      <div className="p-5 flex-1 overflow-auto">
     {/* <ConsultantListingPage /> */}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
