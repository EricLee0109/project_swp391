"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user/User";
import ToolsPanel from "./tools-panel";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllUsers } from "@/app/api/dashboard/user/action";
import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
import { setSearchQueryForHighlight } from "./columns";
const UsersListingPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("*");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setAllUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu người dùng", err));
  }, []);

  // Lọc theo search + role mỗi khi searchQuery hoặc selectedRole thay đổi
  useEffect(() => {
    setSearchQueryForHighlight(searchQuery);
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allUsers.filter((user) => {
      const matchRole = selectedRole === "*" || user.role === selectedRole;
      const matchQuery =
        user.email.toLowerCase().includes(lowerQuery) ||
        user.full_name.toLowerCase().includes(lowerQuery);
      return matchRole && matchQuery;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset về trang đầu
  }, [searchQuery, selectedRole, allUsers]);

  // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex-1 overflow-auto ">
        <ToolsPanel
          onSearch={(q) => setSearchQuery(q)}
          onRoleChange={(role) => setSelectedRole(role)}
        />
        <DataTable
          columns={columns}
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
