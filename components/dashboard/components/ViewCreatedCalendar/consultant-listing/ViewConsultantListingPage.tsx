// "use client";

// import { useEffect, useState } from "react";
// import { ViewCreatedCalendar } from "@/types/ViewCreatedCalendar/ViewCreatedCalendar";
// import ToolsPanel from "./tools-panel";
// import { DataTable } from "./data-table";
// import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";
// import { columns, setSearchQueryForHighlight } from "./columns";
// import { getAvailableSchedulesByConsultant } from "@/app/api/dashboard/ViewCreatedCalendar/action";
// import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";
// import { getAllConsultantProfiles } from "@/app/api/consultant/action";

// const ViewCreatedCalendarPage = () => {
//   const [schedules, setSchedules] = useState<ViewCreatedCalendar[]>([]);
//   const [filteredSchedules, setFilteredSchedules] = useState<ViewCreatedCalendar[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filterSchedules = (data: ViewCreatedCalendar[], query: string) => {
//     const lowerQuery = query.toLowerCase();
//     return data.filter((item) =>
//       item.service.name.toLowerCase().includes(lowerQuery) ||
//       item.start_time.toLowerCase().includes(lowerQuery) ||
//       item.end_time.toLowerCase().includes(lowerQuery)
//     );
//   };

//   const fetchSchedules = async () => {
//     setIsLoading(true);
//     try {
//       const consultants = await getAllConsultantProfiles();
//       if (!consultants || consultants.length === 0) {
//         console.error("Không có consultant nào");
//         return;
//       }

//       const consultantId = consultants[0].consultant.consultant_id; // 👈 lấy ID đầu tiên (hoặc thay đổi theo nhu cầu)
//       const data = await getAvailableSchedulesByConsultant(consultantId);

//       if (data) {
//         setSchedules(data);
//       }
//     } catch (err) {
//       console.error("Lỗi khi fetch lịch tư vấn", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchedules();
//   }, []);

//   useEffect(() => {
//     setSearchQueryForHighlight(searchQuery);
//     const result = filterSchedules(schedules, searchQuery);
//     setFilteredSchedules(result);
//     setCurrentPage(1);
//   }, [schedules, searchQuery]);

//   const currentData = filteredSchedules.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (isLoading) {
//     return (
//       <>
//         <LoadingSkeleton />
//         <LoadingSkeleton />
//         <LoadingSkeleton />
//       </>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-5 flex-1 overflow-auto">
//         <ToolsPanel onSearch={(q) => setSearchQuery(q)} />
//         <DataTable
//           columns={columns()}
//           data={currentData}
//           pageIndex={currentPage - 1}
//           pageSize={itemsPerPage}
//         />
//       </div>
//       <div>
//         <PaginationDashboard
//           page={currentPage}
//           total={filteredSchedules.length}
//           limit={itemsPerPage}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default ViewCreatedCalendarPage;
