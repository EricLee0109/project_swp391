"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { notify } from "@/lib/toastNotify";
import { createShippingSchema } from "@/types/schemas/FormSchemas";
import { ShippingInfoType } from "./CellActions";

type ShippingFormValues = z.infer<typeof createShippingSchema>;

interface CreateShippingFormDialogProps {
  appointment: AppointmentListType;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  shippingInfo: ShippingInfoType | null; // Thêm shippingInfo
}

export function CreateShippingFormDialog({
  appointment,
  open,
  setOpen,
  onSuccess,
  shippingInfo,
}: CreateShippingFormDialogProps) {
  const router = useRouter();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(createShippingSchema),
    defaultValues: {
      provider: shippingInfo?.provider || "GHN",
      contact_name: shippingInfo?.contact_name || appointment.user.full_name || "",
      contact_phone: shippingInfo?.contact_phone || "",
      shipping_address: shippingInfo?.shipping_address || "",
      province: shippingInfo?.province || "",
      district: shippingInfo?.district || "",
      ward: shippingInfo?.ward || "",
      appointment_id: appointment.appointment_id,
    },
  });

  async function onSubmit(data: ShippingFormValues) {
    try {
      const response = await fetch(`/api/shipping/appointments/${data.appointment_id}/order-ghn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });

      const apiRes = await response.json();
      if (!response.ok) {
        throw new Error(apiRes.error || "Không thể tạo đơn vận chuyển.");
      }

      notify("success", "Tạo đơn vận chuyển thành công.");
      onSuccess();
      setOpen(false);
      router.refresh();
    } catch (error) {
      notify("error", (error as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Tạo đơn vận chuyển</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị vận chuyển</FormLabel>
                    <FormControl>
                      <Input placeholder="Giao Hàng Nhanh" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người nhận</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyen Van A" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="09xxxxxxxx" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="shipping_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ giao hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Đường ABC" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <FormControl>
                      <Input placeholder="TP. Hồ Chí Minh" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <FormControl>
                      <Input placeholder="Quận 1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <FormControl>
                      <Input placeholder="Phường Bến Nghé" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="submit">Tạo đơn vận chuyển</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}