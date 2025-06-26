"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

// Adjust this import path to where you have defined your types
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { Home, Hospital } from "lucide-react";

const getTypeBadgeVariant = (type: "Consultation" | "Testing") => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 text-blue-800";
    case "Testing":
      return "bg-green-100 text-green-800";
    default:
      return "default";
  }
};

// const CellActions = ({ row }: { row: Row<ServicesListType> }) => {
//   const service = row.original;
//   const router = useRouter();

//   // State to control shipping dialog
//   const [isShippingDialogOpen, setShippingDialogOpen] = useState(false);

//   const handleVerifyAppointment = async () => {
//     if (!confirm("Are you sure you want to verify this appointment?")) {
//       return;
//     }

//     try {
//       // TODO: Replace this URL with your actual API endpoint.
//       const response = await fetch(
//         `/api/appointments/${service.appointment_id}/confirm`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ notes: "Xác nhận lịch hẹn xét nghiệm" }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Failed to verify the appointment."
//         );
//       }

//       alert("Appointment verified successfully!");
//       router.refresh();
//     } catch (error) {
//       console.error("Verification failed:", error);
//       alert((error as Error).message);
//     }
//   };

//   return (
//     <Dialog open={isShippingDialogOpen} onOpenChange={setShippingDialogOpen}>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>

//           {/* --- "Create Shipping" OPTION --- */}
//           {appointment.type === "Testing" &&
//             appointment.status === "Pending" && (
//               <Link
//                 href={`/dashboard/shipping/create/${appointment.appointment_id}`}
//                 passHref
//               >
//                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                   <TestTube2 className="mr-2 h-4 w-4" />
//                   <span>Create Shipping</span>
//                 </DropdownMenuItem>
//               </Link>
//             )}
//           {/* Consultation confirm */}
//           {appointment.type === "Consultation" &&
//             appointment.status === "Pending" && (
//               <DropdownMenuItem
//                 className="text-green-600 focus:text-green-700 focus:bg-green-50"
//                 onSelect={(e) => {
//                   e.preventDefault();
//                   handleVerifyAppointment();
//                 }}
//               >
//                 <CheckCircle className="mr-2 h-4 w-4" />
//                 <span>Verify Appointment</span>
//               </DropdownMenuItem>
//             )}

//           <DropdownMenuItem
//             onClick={() =>
//               navigator.clipboard.writeText(appointment.appointment_id)
//             }
//           >
//             Copy Appointment ID
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>View Client Details</DropdownMenuItem>
//           <DropdownMenuItem>View Appointment Details</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* {/* The Dialog Content */}
//       {/* <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Shipping Info</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             For Appointment ID: {appointment.appointment_id}
//           </p>
//         </DialogHeader>
//         <div className="py-4">
//           <CreateShippingForm
//             appointmentId={appointment.appointment_id}
//             onFormSubmit={() => setShippingDialogOpen(false)}
//           />
//         </div>
//       </DialogContent> */}
//     </Dialog>
//   );
// };
// 2. The exported columns definition is now cleaner
export const columns: ColumnDef<ServicesListType>[] = [
  {
    accessorKey: "name",
    header: "Service Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "description",
    header: "Service Description",
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: "price",
    header: "Service Price",
    cell: ({ row }) => <div>{row.original.price}</div>,
  },
  {
    accessorKey: "category",
    header: "Service Category",
    cell: ({ row }) => <div>{row.original.category}</div>,
  },
  {
    accessorKey: "type",
    header: "Service Type",
    cell: ({ row }) => {
      const type = row.original.type;
      <Badge className={getTypeBadgeVariant(type)}>{type}</Badge>;
    },
  },
  {
    accessorKey: "daily_capacity",
    header: "Daily Capacity",
    cell: ({ row }) => <div>{row.original.daily_capacity}</div>,
  },
  {
    accessorKey: "available_modes",
    header: "Service Modes",
    cell: ({ row }) => {
      const available_modes = row.original.available_modes;

      const hasHomeMode = available_modes.includes("AT_HOME");
      const hasClinicMode = available_modes.includes("AT_CLINIC");
      return (
        <div className="flex gap-2">
          {hasHomeMode && (
            <span className="flex flex-between gap-1 px-2 py-1 bg-blue-100 rounded">
              <Home size={15} /> Home Service
            </span>
          )}
          {hasClinicMode && (
            <span className="flex flex-between gap-1 px-2 py-1 bg-blue-100 rounded">
              <Hospital size={15} />
              Clinic Service
            </span>
          )}
        </div>
      );
    },
  },

  //   {
  //     id: "actions",
  //     // 3. The cell now just renders our new CellActions component
  //     cell: ({ row }) => <CellActions row={row} />,
  //   },
];
