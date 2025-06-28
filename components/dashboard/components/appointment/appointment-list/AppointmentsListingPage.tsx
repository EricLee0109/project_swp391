"use client";

import { useEffect, useState } from "react";
import ToolsPanel from "./tools-panel";
import { DataTable } from "./data-table";
import { columns } from "../columns";
import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
import { getAllAppointment } from "@/app/api/dashboard/appointment/action";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import Loading from "@/app/(root)/loading";

interface AppointmentApi {
  appointments: AppointmentListType[];
  message: string;
}

const AppointmentListingPage = () => {
  const [allAppointment, setAllAppointment] = useState<AppointmentListType[]>(
    []
  );
  const [filteredAppointment, setFilteredAppointment] = useState<
    AppointmentListType[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("*");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(false);
    getAllAppointment()
      .then((data) => {
        const typedData = data as unknown as AppointmentApi;
        setAllAppointment(typedData.appointments);
        setFilteredAppointment(typedData.appointments);
        console.log(typedData.message, "appointment");
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu người dùng", err))
      .finally(() => setLoading(true));
  }, []);

  // Lọc theo search + Type mỗi khi searchQuery hoặc selectedType thay đổi
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allAppointment.filter((appointment) => {
      const matchType =
        selectedType === "*" || appointment.type === selectedType;
      const matchQuery =
        appointment.user.full_name.toLowerCase().includes(lowerQuery) ||
        appointment.service.name.toLowerCase().includes(lowerQuery);
      return matchType && matchQuery;
    });
    setFilteredAppointment(filtered);
    setCurrentPage(1); // reset về trang đầu
  }, [searchQuery, selectedType, allAppointment]);

  // const totalPages = Math.ceil(filteredAppointment.length / itemsPerPage);

  const handleDeleted = (id: string) => {
    setAllAppointment((prev) => prev.filter((a) => a.appointment_id !== id));
  };

  const currentData = filteredAppointment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loading) return <Loading />;

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex-1 overflow-auto ">
        <ToolsPanel
          onSearch={(q) => setSearchQuery(q)}
          onTypeChange={(type) => setSelectedType(type)}
        />
        <DataTable
          columns={columns({ onDeleted: handleDeleted })}
          data={currentData}
          pageIndex={currentPage - 1}
          pageSize={itemsPerPage}
        />
      </div>
      <div className="">
        <PaginationDashboard
          page={currentPage}
          total={filteredAppointment.length}
          limit={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
export default AppointmentListingPage;
