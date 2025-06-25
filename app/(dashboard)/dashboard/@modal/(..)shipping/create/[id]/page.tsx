"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateShippingClient from "@/app/(dashboard)/dashboard/shipping/create/[id]/CreateShippingClient"; // Your original component

export default function CreateShippingModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // The onClose function will now just navigate the user back
  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Shipping</DialogTitle>
        </DialogHeader>
        <CreateShippingClient appointmentId={params.id} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
