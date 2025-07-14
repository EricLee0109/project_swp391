"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, TestTube2, Info, Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateShippingFormDialog } from "./CreateShippingFormDialog";
import { CreateReturnShippingDialog } from "./CreateReturnShippingDialog";
import { ShippingDetailDialog } from "./ShippingDetailDialog";
import { UpdateShippingDialog } from "./UpdateShippingDialog";
import { UpdateReturnShippingDialog } from "./UpdateReturnShippingDialog";

import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { notify } from "@/lib/toastNotify";

export enum ShippingStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  DeliveredToCustomer = "DeliveredToCustomer",
  PickupRequested = "PickupRequested",
  SampleInTransit = "SampleInTransit",
  ReturnedToLab = "ReturnedToLab",
  Failed = "Failed",
}

export interface ShippingInfoType {
  id: string;
  appointment_id: string;
  provider: string;
  provider_order_code?: string;
  shipping_status: ShippingStatus;
  contact_name: string;
  contact_phone: string;
  shipping_address?: string;
  province?: string;
  district?: string;
  ward?: string;
  pickup_address?: string;
  pickup_province?: string;
  pickup_district?: string;
  pickup_ward?: string;
  expected_delivery_time?: string;
  label_url?: string | null;
  created_at: string;
  updated_at?: string;
}

interface CellActionsProps {
  appointment: AppointmentListType;
  onCreateShipping: (id: string) => void;
  onShippingUpdated: () => void;
}

export default function CellActions({
  appointment,
  onCreateShipping,
  onShippingUpdated,
}: CellActionsProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openReturnDetailDialog, setOpenReturnDetailDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openUpdateReturnDialog, setOpenUpdateReturnDialog] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{
    outbound: ShippingInfoType | null;
    return: ShippingInfoType | null;
  }>({ outbound: null, return: null });

  // Fetch shipping details
  const fetchShippingDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/shipping/appointments/${appointment.appointment_id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        setShippingInfo({ outbound: null, return: null });
        return;
      }
      const data = await res.json();
      setShippingInfo({
        outbound: data.outbound || null,
        return: data.return || null,
      });
    } catch {
      notify("error", "Lỗi mạng khi lấy thông tin vận chuyển.");
      setShippingInfo({ outbound: null, return: null });
    }
  }, [appointment.appointment_id]);

  useEffect(() => {
    fetchShippingDetails();
  }, [fetchShippingDetails]);

  const shouldShowOptions = appointment.type === "Testing";

  // Check conditions for displaying options
  const canCreateOutbound =
    !shippingInfo.outbound || shippingInfo.outbound.shipping_status === ShippingStatus.Pending;

  const canUpdateOutbound =
    shippingInfo.outbound && shippingInfo.outbound.shipping_status !== ShippingStatus.Pending;

  const canCreateReturn =
    shippingInfo.outbound?.shipping_status === ShippingStatus.PickupRequested &&
    !shippingInfo.return;

  const canUpdateReturn =
    shippingInfo.return &&
    [
      ShippingStatus.SampleInTransit,
      ShippingStatus.PickupRequested,
      ShippingStatus.Failed,
    ].includes(shippingInfo.return.shipping_status);

  const canViewReturnDetail = shippingInfo.return !== null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

          {shouldShowOptions && (
            <>
              {canCreateOutbound && (
                <DropdownMenuItem onSelect={() => setOpenCreateDialog(true)}>
                  <TestTube2 className="mr-2 h-4 w-4" /> Tạo đơn vận chuyển
                </DropdownMenuItem>
              )}
              {canUpdateOutbound && (
                <DropdownMenuItem onSelect={() => setOpenUpdateDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Cập nhật đơn vận chuyển (Chiều đi)
                </DropdownMenuItem>
              )}
              {canCreateReturn && (
                <DropdownMenuItem onSelect={() => setOpenReturnDialog(true)}>
                  <Package className="mr-2 h-4 w-4" /> Tạo đơn trả mẫu
                </DropdownMenuItem>
              )}
              {shippingInfo.outbound && (
                <DropdownMenuItem onSelect={() => setOpenDetailDialog(true)}>
                  <Info className="mr-2 h-4 w-4" /> Xem chi tiết đơn vận chuyển (Chiều đi)
                </DropdownMenuItem>
              )}
              {canViewReturnDetail && (
                <DropdownMenuItem onSelect={() => setOpenReturnDetailDialog(true)}>
                  <Info className="mr-2 h-4 w-4" /> Xem chi tiết đơn trả mẫu (Chiều về)
                </DropdownMenuItem>
              )}
              {canUpdateReturn && (
                <DropdownMenuItem onSelect={() => setOpenUpdateReturnDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Cập nhật trạng thái đơn trả mẫu (Chiều về)
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateShippingFormDialog
        appointment={appointment}
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSuccess={() => {
          onCreateShipping(appointment.appointment_id);
          fetchShippingDetails();
        }}
        shippingInfo={shippingInfo.outbound}
      />
      <CreateReturnShippingDialog
        appointmentId={appointment.appointment_id}
        open={openReturnDialog}
        setOpen={setOpenReturnDialog}
        onSuccess={() => {
          fetchShippingDetails();
          onShippingUpdated();
        }}
      />
      <ShippingDetailDialog
        shippingInfo={shippingInfo.outbound}
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        direction="outbound"
      />
      <ShippingDetailDialog
        shippingInfo={shippingInfo.return}
        open={openReturnDetailDialog}
        setOpen={setOpenReturnDetailDialog}
        direction="return"
      />
      <UpdateShippingDialog
        shippingInfo={shippingInfo.outbound}
        appointmentId={appointment.appointment_id}
        open={openUpdateDialog}
        setOpen={setOpenUpdateDialog}
        onUpdateSuccess={() => {
          fetchShippingDetails();
          setOpenUpdateDialog(false);
          onShippingUpdated();
        }}
      />
      <UpdateReturnShippingDialog
        shippingInfo={shippingInfo.return}
        appointmentId={appointment.appointment_id}
        open={openUpdateReturnDialog}
        setOpen={setOpenUpdateReturnDialog}
        onUpdateSuccess={() => {
          fetchShippingDetails();
          setOpenUpdateReturnDialog(false);
          onShippingUpdated();
        }}
      />
    </>
  );
}