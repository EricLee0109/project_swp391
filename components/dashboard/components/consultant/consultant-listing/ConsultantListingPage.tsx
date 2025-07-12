// "use client";

// import { useEffect, useState } from "react";
// import { ConsultantProfile } from "@/types/user/User";
// import ToolsPanel from "./tools-panel";
// import { DataTable } from "./data-table";
// import { columns } from "./columns";
// import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
// import { setSearchQueryForHighlight } from "./columns";
// import { getAllConsultantProfiles } from "@/app/api/consultant/action";

// const ConsultantListingPage = () => {
//   const [allConsultants, setAllConsultants] = useState<ConsultantProfile[]>([]);
//   const [filteredConsultants, setFilteredConsultants] = useState<ConsultantProfile[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRole, setSelectedRole] = useState("*");
//   const [selectedSpecialization, setSelectedSpecialization] = useState("*");
//   const [selectedQualification, setSelectedQualification] = useState("*");

//   const [specializationOptions, setSpecializationOptions] = useState<string[]>([]);
//   const [qualificationOptions, setQualificationOptions] = useState<string[]>([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filterConsultants = (
//     consultants: ConsultantProfile[],
//     query: string,
//     role: string,
//     specialization: string,
//     qualification: string
//   ) => {
//     const lowerQuery = query.toLowerCase();
//     return consultants.filter((consultant) => {
//       const matchRole = role === "*" || consultant.user.role === role;
//       const matchSpec = specialization === "*" || consultant.specialization === specialization;
//       const matchQual = qualification === "*" || consultant.qualifications === qualification;
//       const matchQuery =
//         consultant.user.email.toLowerCase().includes(lowerQuery) ||
//         consultant.user.full_name.toLowerCase().includes(lowerQuery);
//       return matchRole && matchSpec && matchQual && matchQuery;
//     });
//   };

//   const refreshConsultants = async () => {
//     try {
//       const data = await getAllConsultantProfiles();
//       if (data) {
//         setAllConsultants(data);

//         const specs = Array.from(
//           new Set(data.map((c) => c.specialization).filter(Boolean))
//         );
//         const quals = Array.from(
//           new Set(data.map((c) => c.qualifications).filter(Boolean))
//         );

//         setSpecializationOptions(specs);
//         setQualificationOptions(quals);
//       }
//     } catch (err) {
//       console.error("Lỗi khi làm mới danh sách tư vấn viên", err);
//     }
//   };

//   useEffect(() => {
//     refreshConsultants();
//   }, []);

//   useEffect(() => {
//     setSearchQueryForHighlight(searchQuery);
//     const result = filterConsultants(
//       allConsultants,
//       searchQuery,
//       selectedRole,
//       selectedSpecialization,
//       selectedQualification
//     );
//     setFilteredConsultants(result);
//     setCurrentPage(1);
//   }, [allConsultants, searchQuery, selectedRole, selectedSpecialization, selectedQualification]);

//   const currentData = filteredConsultants.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-5 flex-1 overflow-auto">
//         <ToolsPanel
//           onSearch={(q) => setSearchQuery(q)}
//           onRoleChange={(role) => setSelectedRole(role)}
//           onSpecializationChange={(spec) => setSelectedSpecialization(spec)}
//           specializationOptions={specializationOptions}
//           onQualificationsChange={(q) => setSelectedQualification(q)}
//           qualificationOptions={qualificationOptions}
//         />
//         <DataTable
//           columns={columns(refreshConsultants)}
//           data={currentData}
//           pageIndex={currentPage - 1}
//           pageSize={itemsPerPage}
//         />
//       </div>
//       <div>
//         <PaginationDashboard
//           page={currentPage}
//           total={filteredConsultants.length}
//           limit={itemsPerPage}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default ConsultantListingPage;
