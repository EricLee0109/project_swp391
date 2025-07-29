"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import ToolsPanel from "@/components/dashboard/components/healthServices/healthService-list/tools-panel";
import { columns, setSearchQueryForHighlight } from "./columns";
import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
import { getAllHealthServices } from "@/app/api/dashboard/healthService/action";

import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import HealthServicesForm from "@/components/dashboard/components/healthServices/healthService-list/HealthServicesForm";
import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";

const HealthServiceListingPage = () => {
  const [allHealthServices, setAllHealthServices] = useState<
    ServicesListType[]
  >([]);
  const [filteredHealthServices, setFilteredHealthServices] = useState<
    ServicesListType[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("*");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<
    ServicesListType | undefined
  >(undefined);
  const itemsPerPage = 10;

  const handleUpdateServices = (updatedServices: ServicesListType[]) => {
    setAllHealthServices(updatedServices);
    setServiceToEdit(undefined);
    // notify("success","Cập nhật danh sách dịch vụ thành công");
  };

  useEffect(() => {
    setLoading(false);
    getAllHealthServices()
      .then((data) => {
        setAllHealthServices(data);
        setFilteredHealthServices(data);
      })
      .catch((err) => console.error("Error loading health services", err))
      .finally(() => setLoading(true));
  }, []);

  useEffect(() => {
    setSearchQueryForHighlight(searchQuery);
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allHealthServices.filter((service) => {
      const matchCategory =
        selectedCategory === "*" || service.category === selectedCategory;
      const matchQuery =
        service.name.toLowerCase().includes(lowerQuery) ||
        (service.description &&
          service.description.toLowerCase().includes(lowerQuery));
      return matchCategory && matchQuery;
    });
    setFilteredHealthServices(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, allHealthServices]);

  const currentData = filteredHealthServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex-1 overflow-auto ">
        <ToolsPanel
          onSearch={(q) => setSearchQuery(q)}
          onTypeChange={(cat) => setSelectedCategory(cat)}
        />
        <div className="flex justify-end mb-4">
          <HealthServicesForm
            isOpen={isCreateDialogOpen}
            onClose={() => {
              setIsCreateDialogOpen(false);
              setServiceToEdit(undefined);
            }}
            onSave={handleUpdateServices}
            services={allHealthServices}
            setIsOpen={setIsCreateDialogOpen}
            serviceToEdit={serviceToEdit}
          />
        </div>
        <DataTable
          columns={columns}
          data={currentData}
          pageIndex={currentPage - 1}
          pageSize={itemsPerPage}
          onUpdateServices={handleUpdateServices}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          setServiceToEdit={setServiceToEdit}
        />
      </div>
      <div>
        <PaginationDashboard
          page={currentPage}
          total={filteredHealthServices.length}
          limit={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default HealthServiceListingPage;
