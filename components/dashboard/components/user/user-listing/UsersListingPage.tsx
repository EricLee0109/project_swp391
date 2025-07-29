"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user/User";
import ToolsPanel from "./tools-panel";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllUsers } from "@/app/api/dashboard/user/action";
import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
import { setSearchQueryForHighlight } from "./columns";
import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";

const UsersListingPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("*");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ Gộp logic lọc lại cho dễ tái sử dụng
  const filterUsers = (users: User[], query: string, role: string) => {
    const lowerQuery = query.toLowerCase();
    return users.filter((user) => {
      const matchRole = role === "*" || user.role === role;
      const matchQuery =
        user.email.toLowerCase().includes(lowerQuery) ||
        user.full_name.toLowerCase().includes(lowerQuery) ||
        user?.phone_number?.includes(lowerQuery);
      return matchRole && matchQuery;
    });
  };

  const refreshUsers = async () => {
    setIsLoading(false);
    try {
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (err) {
      console.error("Lỗi khi làm mới danh sách người dùng", err);
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    refreshUsers(); // load lần đầu
  }, []);

  // ✅ Khi search hoặc filter role → reset về trang đầu
  useEffect(() => {
    setSearchQueryForHighlight(searchQuery);
    const result = filterUsers(allUsers, searchQuery, selectedRole);
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [allUsers, searchQuery, selectedRole]);

  // ✅ Khi allUsers thay đổi → lọc lại theo filter hiện tại, nhưng không reset page
  useEffect(() => {
    const result = filterUsers(allUsers, searchQuery, selectedRole);
    setFilteredUsers(result);
  }, [allUsers, searchQuery, selectedRole]);

  const currentData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isLoading)
    return (
      <>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex-1 overflow-auto ">
        <ToolsPanel
          onSearch={(q) => setSearchQuery(q)}
          onRoleChange={(role) => setSelectedRole(role)}
        />
        <DataTable
          columns={columns(refreshUsers)}
          data={currentData}
          pageIndex={currentPage - 1}
          pageSize={itemsPerPage}
        />
      </div>
      <div className="">
        <PaginationDashboard
          page={currentPage}
          total={filteredUsers.length}
          limit={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
export default UsersListingPage;
