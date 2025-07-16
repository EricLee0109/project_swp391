"use client";

import React, { memo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

// Validation schema
const formSchema = z.object({
  startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
  startTime: z.string().min(1, "Chọn giờ bắt đầu"),
  endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
  endTime: z.string().min(1, "Chọn giờ kết thúc"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleDetail {
  schedule_id: string;
  consultant_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
  deleted_at: string | null;
  max_appointments_per_day: number;
  service: {
    name: string;
  };
}

interface PaymentActionsDropdownProps {
  scheduleId: string;
  onDeleted?: () => void;
  onUpdated?: () => void;
  serverAccessToken?: string;
  appointmentId?: string;
}

const PaymentActionsDropdown = memo(function PaymentActionsDropdown({
  scheduleId,
  onDeleted,
  onUpdated,
  serverAccessToken,
  appointmentId,
}: PaymentActionsDropdownProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(scheduleId);
    notify("success", "Đã sao chép ID lịch!");
  };

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [services, setServices] = useState<{ service_id: string; name: string; type: string }[]>([]);
  const [initialData, setInitialData] = useState<ScheduleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

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

  useEffect(() => {
    let isMounted = true;

    const fetchScheduleData = async () => {
      if (!serverAccessToken || !isMounted) return;

      setIsLoading(true);
      try {
        console.log("Fetching schedule data for scheduleId:", scheduleId);
        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${serverAccessToken}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Không thể tải dữ liệu lịch.");
        }
        const data = await res.json();
        console.log("Schedule data received:", data);
        if (isMounted) {
          setInitialData(data.schedule);

          const start = parseISO(data.schedule.start_time);
          const end = parseISO(data.schedule.end_time);
          form.setValue("startDate", start);
          form.setValue("startTime", format(start, "HH:mm:ss"));
          form.setValue("endDate", end);
          form.setValue("endTime", format(end, "HH:mm:ss"));
          form.setValue("serviceId", data.schedule.service_id);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        if (isMounted) notify("error", "Không thể tải dữ liệu lịch.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const fetchServices = async () => {
      if (!isMounted) return;

      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Không thể tải danh sách dịch vụ.");
        const data = await res.json();
        const consultationServices = data.filter(
          (service: { service_id: string; name: string; type: string }) =>
            service.type === "Consultation"
        );
        if (isMounted) setServices(consultationServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        if (isMounted) notify("error", "Không thể tải danh sách dịch vụ.");
      }
    };

    fetchScheduleData();
    fetchServices();

    return () => {
      isMounted = false;
    };
  }, [scheduleId, serverAccessToken, form]);

  const onSubmit = async (values: FormValues) => {
    if (!serverAccessToken) {
      notify("error", "Không tìm thấy token xác thực.");
      return;
    }

    try {
      const [sh, sm, ss] = values.startTime.split(":").map(Number);
      const [eh, em, es] = values.endTime.split(":").map(Number);

      const start = new Date(values.startDate);
      start.setHours(sh, sm, ss);

      const end = new Date(values.endDate);
      end.setHours(eh, em, es);

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

const handleConfirm = async () => {
    if (!serverAccessToken || !appointmentId) {
      notify("error", "Không tìm thấy token hoặc ID lịch hẹn.");
      return;
    }

    try {
      console.log("Confirming with appointmentId:", appointmentId);
      const res = await fetch(`/api/appointments/${appointmentId}/confirm`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAccessToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Confirm API response:", err);
        notify("error", err.message || "Xác nhận lịch hẹn thất bại.");
        return;
      }

      notify("success", "Xác nhận lịch hẹn thành công!");
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      notify("error", "Có lỗi xảy ra khi xác nhận lịch hẹn.");
    }
  };

  const handleStart = async () => {
    if (!serverAccessToken || !appointmentId) {
      notify("error", "Không tìm thấy token hoặc ID lịch hẹn.");
      return;
    }

    try {
      console.log("Starting consultation with appointmentId:", appointmentId);
      const res = await fetch(`/api/appointments/${appointmentId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAccessToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Start API response:", err);
        notify("error", err.message || "Bắt đầu tư vấn thất bại.");
        return;
      }

      notify("success", "Bắt đầu tư vấn thành công!");
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Error starting consultation:", error);
      notify("error", "Có lỗi xảy ra khi bắt đầu tư vấn.");
    }
  };

  const handleComplete = async () => {
    if (!serverAccessToken || !appointmentId) {
      notify("error", "Không tìm thấy token hoặc ID lịch hẹn.");
      return;
    }

    try {
      console.log("Completing consultation with appointmentId:", appointmentId);
      const res = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAccessToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Complete API response:", err);
        notify("error", err.message || "Hoàn thành tư vấn thất bại.");
        return;
      }

      notify("success", "Hoàn thành tư vấn thành công!");
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Error completing consultation:", error);
      notify("error", "Có lỗi xảy ra khi hoàn thành tư vấn.");
    }
  };

  const handleConfirmClick = () => {
    if (appointmentId) {
      setShowConfirmDialog(true);
    } else {
      notify("error", "Không có lịch hẹn để xác nhận.");
    }
  };

  const handleStartClick = () => {
    if (appointmentId) {
      setShowStartDialog(true);
    } else {
      notify("error", "Không có lịch hẹn để bắt đầu.");
    }
  };

  const handleCompleteClick = () => {
    if (appointmentId) {
      setShowCompleteDialog(true);
    } else {
      notify("error", "Không có lịch hẹn để bắt đầu.");
    }
  };

  const confirmAction = () => {
    setShowConfirmDialog(false);
    handleConfirm();
  };

  const startAction = () => {
    setShowStartDialog(false);
    handleStart();
  };

  const completeAction = () => {
    setShowCompleteDialog(false);
    handleComplete();
  };

  // Debug appointmentId
  useEffect(() => {
    console.log("PaymentActionsDropdown rendered with appointmentId:", appointmentId);
  }, [appointmentId]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="text-xl leading-none cursor-pointer">...</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>Sao chép ID</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenUpdateDialog(true)}>
            Cập nhật
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleConfirmClick} disabled={!appointmentId}>
            Xác nhận lịch hẹn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStartClick} disabled={!appointmentId}>
            Bắt đầu tư vấn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCompleteClick} disabled={!appointmentId}>
            Hoàn thành tư vấn
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteScheduleDialog
              scheduleId={scheduleId}
              onDeleted={onDeleted}
              trigger={<span className="text-red-500 cursor-pointer pl-2">Xóa</span>}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật lịch</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Popover
                        open={form.formState.isDirty || !initialData ? undefined : false}
                        onOpenChange={form.formState.isDirty || !initialData ? undefined : () => { }}
                      >
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
                            onSelect={(date) => form.setValue("startDate", date as Date)}
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
                      <Popover
                        open={form.formState.isDirty || !initialData ? undefined : false}
                        onOpenChange={form.formState.isDirty || !initialData ? undefined : () => { }}
                      >
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
                            onSelect={(date) => form.setValue("endDate", date as Date)}
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
              </>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenUpdateDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xác nhận lịch hẹn này?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bắt đầu tư vấn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn bắt đầu buổi tư vấn này?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={startAction}>
              Bắt đầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hoàn thành tư vấn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn  buổi tư vấn này đã hoàn thành?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={completeAction}>
              Hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default PaymentActionsDropdown;