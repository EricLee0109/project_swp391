import UsersListingPage from "@/components/dashboard/components/user/user-listing/UsersListingPage";
import Header from "@/components/dashboard/header";


const UsersPage = () => {
  
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách tài khoản" />
      <div className="p-5 flex-1 overflow-auto">
       <UsersListingPage />
      </div>
    </div>
  );
};

export default UsersPage;
