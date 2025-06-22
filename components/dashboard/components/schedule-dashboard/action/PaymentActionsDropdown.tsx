"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DeleteScheduleDialog } from "./DeleteScheduleDialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/toastNotify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

// Validation schema
const formSchema = z.object({
  startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
  startTime: z.string().min(1, "Chọn giờ bắt đầu"),
  endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
  endTime: z.string().min(1, "Chọn giờ kết thúc"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentActionsDropdownProps {
  scheduleId: string;
  onDeleted?: () => void;
  onUpdated?: () => void;
  serverAccessToken?: string;
}

export function PaymentActionsDropdown({
  scheduleId,
  onDeleted,
  onUpdated,
  serverAccessToken,
}: PaymentActionsDropdownProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(scheduleId);
  };

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [services, setServices] = useState<{ service_id: string; name: string; type: string }[]>([]);
  const [initialData, setInitialData] = useState<{
    start_time: string;
    end_time: string;
    service_id: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      startTime: "09:00:00",
      endDate: new Date(),
      endTime: "10:00:00",
      serviceId: "",
    },
  });

  // Fetch schedule data and services
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        if (!serverAccessToken) throw new Error("No access token found");

        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${serverAccessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch schedule data");
        const data = await res.json();
        setInitialData({
          start_time: data.start_time,
          end_time: data.end_time,
          service_id: data.service_id,
        });

        // Set default form values
        const start = parseISO(data.start_time);
        const end = parseISO(data.end_time);
        form.setValue("startDate", start);
        form.setValue("startTime", format(start, "HH:mm:ss"));
        form.setValue("endDate", end);
        form.setValue("endTime", format(end, "HH:mm:ss"));
        form.setValue("serviceId", data.service_id);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        // Filter for type "Consultation"
        const consultationServices = data.filter(
          (service: { service_id: string; name: string; type: string }) =>
            service.type === "Consultation"
        );
        setServices(consultationServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        notify("error", "Không thể tải danh sách dịch vụ.");
      }
    };

    fetchScheduleData();
    fetchServices();
  }, [scheduleId, serverAccessToken, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const [sh, sm, ss] = values.startTime.split(":").map(Number);
      const [eh, em, es] = values.endTime.split(":").map(Number);

      const start = new Date(values.startDate);
      start.setHours(sh, sm, ss);

      const end = new Date(values.endDate);
      end.setHours(eh, em, es);

      if (!serverAccessToken) throw new Error("No access token found");

      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAccessToken}`,
        },
        body: JSON.stringify({
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          service_id: values.serviceId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        notify("error", err.message || "Cập nhật lịch thất bại.");
        return;
      }

      notify("success", "Cập nhật lịch thành công!");
      setOpenUpdateDialog(false);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Error updating schedule:", error);
      notify("error", "Có lỗi xảy ra khi cập nhật lịch.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-xl leading-none">...</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleCopy}>Sao chép ID</DropdownMenuItem>

        <DropdownMenuItem onClick={() => setOpenUpdateDialog(true)}>
          Cập nhật
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteScheduleDialog
            scheduleId={scheduleId}
            onDeleted={onDeleted}
            trigger={
              <span className="text-red-500 cursor-pointer pl-2">Xóa</span>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật lịch</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div>
              <Label>Ngày bắt đầu</Label>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <Popover open={form.formState.isDirty || !initialData ? undefined : false} onOpenChange={form.formState.isDirty || !initialData ? undefined : () => {}}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-36 justify-between font-normal"
                      >
                        {form.watch("startDate")
                          ? format(form.watch("startDate"), "dd/MM/yyyy")
                          : "Chọn ngày"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("startDate")}
                        captionLayout="dropdown"
                        locale={vi}
                        onSelect={(date) => {
                          form.setValue("startDate", date as Date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="time"
                    step="1"
                    {...form.register("startTime")}
                    className="bg-background"
                  />
                  {form.formState.errors.startTime && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>Ngày kết thúc</Label>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <Popover open={form.formState.isDirty || !initialData ? undefined : false} onOpenChange={form.formState.isDirty || !initialData ? undefined : () => {}}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-36 justify-between font-normal"
                      >
                        {form.watch("endDate")
                          ? format(form.watch("endDate"), "dd/MM/yyyy")
                          : "Chọn ngày"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("endDate")}
                        captionLayout="dropdown"
                        locale={vi}
                        onSelect={(date) => {
                          form.setValue("endDate", date as Date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.endDate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="time"
                    step="1"
                    {...form.register("endTime")}
                    className="bg-background"
                  />
                  {form.formState.errors.endTime && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceId">Dịch vụ</Label>
              <select
                id="serviceId"
                {...form.register("serviceId")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Chọn dịch vụ
                </option>
                {services
                  .filter((service) => service.type === "Consultation")
                  .map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      {service.name}
                    </option>
                  ))}
              </select>
              {form.formState.errors.serviceId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.serviceId.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenUpdateDialog(false)}>
                Hủy
              </Button>
              <Button type="submit">Cập nhật</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}