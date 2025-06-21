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
  serviceId: z.string().min(1, "Nhập mã dịch vụ"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateSchedule() {
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

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

  const onSubmit = async (values: FormValues) => {
    try {
      const [sh, sm, ss] = values.startTime.split(":").map(Number);
      const [eh, em, es] = values.endTime.split(":").map(Number);

      const start = new Date(values.startDate);
      start.setHours(sh, sm, ss);

      const end = new Date(values.endDate);
      end.setHours(eh, em, es);

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch {
      notify("error", "Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <div className="mb-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Tạo lịch mới</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo lịch tư vấn mới</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
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
                        {/* Có Util formatDate */}
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

            {/* End time */}
            <div>
              <Label className="px-1">Ngày kết thúc</Label>
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

            {/* Service ID */}
            <div className="grid gap-2">
              <Label htmlFor="serviceId">Mã dịch vụ</Label>
              <Input
                id="serviceId"
                placeholder="Nhập mã dịch vụ (vd: svc003)"
                {...form.register("serviceId")}
              />
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
