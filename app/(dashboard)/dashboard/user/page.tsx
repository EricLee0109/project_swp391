
import users from "@/data/users.json";
;
import Header from "@/components/dashboard/header";
import { User } from "@/types/user/User";
import ToolsPanel from "@/components/dashboard/components/user/user-listing/tools-panel";
import { DataTable } from "@/components/dashboard/components/user/user-listing/data-table";
import { columns } from "@/components/dashboard/components/user/user-listing/columns";
const UsersListingPage = () => {
  const data = users as User[];
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách tài khoản" />
      <div className="p-5 flex-1 overflow-auto">
        <ToolsPanel />
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default UsersListingPage;
