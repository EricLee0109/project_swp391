"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notify } from "@/lib/toastNotify";
import { vi } from "date-fns/locale";

// Validation schema
const formSchema = z.object({
  startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
  startTime: z.string().min(1, "Chọn giờ bắt đầu"),
  endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
  endTime: z.string().min(1, "Chọn giờ kết thúc"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});

type FormValues = z.infer<typeof formSchema>;

interface Service {
  service_id: string;
  name: string;
  type: string;
}

interface CreateScheduleProps {
  serverAccessToken?: string;
  onScheduleCreated?: () => void;
}

export default function CreateSchedule({ serverAccessToken, onScheduleCreated }: CreateScheduleProps) {
  const [open, setOpen] = React.useState(false); // ĐIỀU KHIỂN DIALOG
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [services, setServices] = React.useState<Service[]>([]);

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

  // Fetch services on component mount
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        // Filter for type "Consultation"
        const consultationServices = data.filter(
          (service: Service) => service.type === "Consultation"
        );
        setServices(consultationServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        notify("error", "Không thể tải danh sách dịch vụ.");
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const [sh, sm, ss] = values.startTime.split(":").map(Number);
      const [eh, em, es] = values.endTime.split(":").map(Number);

      const start = new Date(values.startDate);
      start.setHours(sh, sm, ss);

      const end = new Date(values.endDate);
      end.setHours(eh, em, es);

      if (!serverAccessToken) throw new Error("No access token found");

      const res = await fetch("/api/schedules", {
        method: "POST",
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
        notify("error", err.message || "Tạo lịch thất bại.");
        return;
      }

      notify("success", "Tạo lịch thành công!");
      form.reset();
      setOpen(false); // ĐÓNG DIALOG SAU KHI TẠO XONG
      if (onScheduleCreated) onScheduleCreated();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      notify("error", errMsg || "Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <div className="mb-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Tạo lịch mới</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo lịch tư vấn mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div>
              <Label>Ngày bắt đầu</Label>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <Popover open={openStart} onOpenChange={setOpenStart}>
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
                          setOpenStart(false);
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
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
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
                          setOpenEnd(false);
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
                {services.map((service) => (
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
              <Button type="submit">Tạo lịch</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
