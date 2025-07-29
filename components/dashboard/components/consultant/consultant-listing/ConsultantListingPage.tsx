"use client";

import { useEffect, useState } from "react";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import ToolsPanel from "./tools-panel";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
import { setSearchQueryForHighlight } from "./columns";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";
import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";

const ConsultantListingPage = () => {
  const [allConsultants, setAllConsultants] = useState<ConsultantGetAll[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<
    ConsultantGetAll[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("*");
  const [selectedSpecialization, setSelectedSpecialization] = useState("*");
  const [selectedQualification, setSelectedQualification] = useState("*");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [specializationOptions, setSpecializationOptions] = useState<string[]>(
    []
  );
  const [qualificationOptions, setQualificationOptions] = useState<string[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterConsultants = (
    consultants: ConsultantGetAll[],
    query: string,
    role: string,
    specialization: string,
    qualification: string
  ) => {
    const lowerQuery = query.toLowerCase();

    return consultants.filter((consultant) => {
      const matchRole = role === "*" || consultant.role === role;
      const matchSpec =
        specialization === "*" ||
        consultant.consultant?.specialization === specialization;
      const matchQual =
        qualification === "*" ||
        consultant.consultant?.qualifications === qualification;
      const matchQuery =
        consultant.email.toLowerCase().includes(lowerQuery) ||
        consultant.full_name.toLowerCase().includes(lowerQuery) ||
        consultant.phone_number.includes(lowerQuery);

      return matchRole && matchSpec && matchQual && matchQuery;
    });
  };

  const refreshConsultants = async () => {
    setIsLoading(false);
    try {
      const data = await getAllConsultantProfiles();
      if (data) {
        setAllConsultants(data);

        const specs = Array.from(
          new Set(data.map((c) => c.consultant?.specialization).filter(Boolean))
        );
        const quals = Array.from(
          new Set(data.map((c) => c.consultant?.qualifications).filter(Boolean))
        );

        setSpecializationOptions(specs);
        setQualificationOptions(quals);
      }
    } catch (err) {
      console.error("Lỗi khi làm mới danh sách tư vấn viên", err);
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    refreshConsultants();
  }, []);

  useEffect(() => {
    setSearchQueryForHighlight(searchQuery);
    const result = filterConsultants(
      allConsultants,
      searchQuery,
      selectedRole,
      selectedSpecialization,
      selectedQualification
    );
    setFilteredConsultants(result);
    setCurrentPage(1);
  }, [
    allConsultants,
    searchQuery,
    selectedRole,
    selectedSpecialization,
    selectedQualification,
  ]);

  const currentData = filteredConsultants.slice(
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
      <div className="p-5 flex-1 overflow-auto">
        <ToolsPanel
          onSearch={(q) => setSearchQuery(q)}
          onRoleChange={(role) => setSelectedRole(role)}
          onSpecializationChange={(spec) => setSelectedSpecialization(spec)}
          specializationOptions={specializationOptions}
          onQualificationsChange={(q) => setSelectedQualification(q)}
          qualificationOptions={qualificationOptions}
        />
        <DataTable
          columns={columns(refreshConsultants)}
          data={currentData}
          pageIndex={currentPage - 1}
          pageSize={itemsPerPage}
        />
      </div>
      <div>
        <PaginationDashboard
          page={currentPage}
          total={filteredConsultants.length}
          limit={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ConsultantListingPage;
