"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, TestTube2, Info, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateShippingFormDialog } from "./CreateShippingFormDialog";
import { ShippingDetailDialog } from "./ShippingDetailDialog";
import { UpdateShippingDialog } from "./UpdateShippingDialog";
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
  shipping_address: string;
  province: string;
  district: string;
  ward: string;
  expected_delivery_time?: string;
  label_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export default function CellActions({
  appointment,
  onCreateShipping,
  onShippingUpdated,
}: {
  appointment: AppointmentListType;
  onCreateShipping: (id: string) => void;
  onShippingUpdated: () => void;
}) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType | null>(null);

  const fetchShippingDetails = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/shipping/appointments/${appointment.appointment_id}`,
        { credentials: "include", cache: "no-store" }
      );

      if (res.ok) {
        const apiRes = await res.json();
        if (apiRes.outbound && apiRes.outbound.id) {
          const detailRes = await fetch(`/api/shipping/${apiRes.outbound.id}`, {
            credentials: "include",
            cache: "no-store",
          });
          const shippingDetail = await detailRes.json();
          if (detailRes.ok) {
            setShippingInfo(shippingDetail);
          } else {
            setShippingInfo(null);
          }
        } else {
          setShippingInfo(null);
        }
      } else {
        setShippingInfo(null);
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    }
  }, [appointment.appointment_id]);

  useEffect(() => {
    fetchShippingDetails();
  }, [fetchShippingDetails]);

  const shouldShowOptions = appointment.type === "Testing";

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
              <DropdownMenuItem onSelect={() => setOpenCreateDialog(true)}>
                <TestTube2 className="mr-2 h-4 w-4" /> Tạo đơn vận chuyển
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenDetailDialog(true)}>
                <Info className="mr-2 h-4 w-4" /> Xem chi tiết
              </DropdownMenuItem>
              {shippingInfo && (
                <DropdownMenuItem onSelect={() => setOpenUpdateDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Cập nhật
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
        shippingInfo={shippingInfo}
      />

      <ShippingDetailDialog
        shippingInfo={shippingInfo}
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
      />

      <UpdateShippingDialog
        shippingInfo={shippingInfo}
        appointmentId={appointment.appointment_id}
        open={openUpdateDialog}
        setOpen={setOpenUpdateDialog}
        onUpdateSuccess={() => {
          fetchShippingDetails();
          setOpenUpdateDialog(false);
          onShippingUpdated();
        }}
      />
    </>
  );
}
