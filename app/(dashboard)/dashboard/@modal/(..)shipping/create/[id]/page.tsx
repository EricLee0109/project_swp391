export default function Page() {
  return <div>Shipping Modal</div>;
}

// "use client";

// import { useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import CreateShippingClient from "@/app/(dashboard)/dashboard/shipping/create/[id]/CreateShippingClient"; // Your original component
// import { use } from "react";

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default function CreateShippingModal(props: PageProps) {
//   const router = useRouter();
//   const params = use(props.params);
//   const appointmentId = params.id;

//   // The onClose function will now just navigate the user back
//   const handleClose = () => {
//     router.back();
//   };

//   return (
//     <Dialog open={true} onOpenChange={() => router.back()}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Shipping</DialogTitle>
//         </DialogHeader>
//         <CreateShippingClient
//           appointmentId={appointmentId}
//           onClose={handleClose}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }
