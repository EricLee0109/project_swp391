"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, Clock, CalendarDays } from "lucide-react";

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
// Removed tabs import - using custom toggle instead
import { notify } from "@/lib/toastNotify";
import { vi } from "date-fns/locale";

// Validation schema for single schedule
const singleFormSchema = z.object({
  startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
  startTime: z.string().min(1, "Chọn giờ bắt đầu"),
  endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
  endTime: z.string().min(1, "Chọn giờ kết thúc"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});

// Validation schema for batch schedules
const batchFormSchema = z.object({
  startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
  startTime: z.string().min(1, "Chọn giờ bắt đầu"),
  endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
  endTime: z.string().min(1, "Chọn giờ kết thúc"),
  durationMinutes: z
    .number()
    .min(15, "Thời lượng tối thiểu 15 phút")
    .max(120, "Thời lượng tối đa 120 phút"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});

type SingleFormValues = z.infer<typeof singleFormSchema>;
type BatchFormValues = z.infer<typeof batchFormSchema>;

interface Service {
  service_id: string;
  name: string;
  type: string;
}

interface CreateScheduleProps {
  serverAccessToken?: string;
  onScheduleCreated?: () => void;
}

export default function CreateSchedule({
  serverAccessToken,
  onScheduleCreated,
}: CreateScheduleProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("single");
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const singleForm = useForm<SingleFormValues>({
    resolver: zodResolver(singleFormSchema),
    defaultValues: {
      startDate: new Date(),
      startTime: "09:00:00",
      endDate: new Date(),
      endTime: "10:00:00",
      serviceId: "",
    },
  });

  const batchForm = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      startDate: new Date(),
      startTime: "09:00:00",
      endDate: new Date(),
      endTime: "17:00:00",
      durationMinutes: 60,
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

  // Calculate estimated slots for batch creation
  const calculateEstimatedSlots = () => {
    const values = batchForm.getValues();
    if (
      !values.startDate ||
      !values.endDate ||
      !values.startTime ||
      !values.endTime ||
      !values.durationMinutes
    ) {
      return 0;
    }

    const [sh, sm, ss] = values.startTime.split(":").map(Number);
    const [eh, em, es] = values.endTime.split(":").map(Number);

    const start = new Date(values.startDate);
    start.setHours(sh, sm, ss);

    const end = new Date(values.endDate);
    end.setHours(eh, em, es);

    if (start >= end) return 0;

    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.floor(totalMinutes / values.durationMinutes);
  };

  const onSubmitSingle = async (values: SingleFormValues) => {
    setIsSubmitting(true);
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
      singleForm.reset();
      setOpen(false);
      if (onScheduleCreated) onScheduleCreated();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      notify("error", errMsg || "Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitBatch = async (values: BatchFormValues) => {
    setIsSubmitting(true);
    try {
      const [sh, sm, ss] = values.startTime.split(":").map(Number);
      const [eh, em, es] = values.endTime.split(":").map(Number);

      const start = new Date(values.startDate);
      start.setHours(sh, sm, ss);

      const end = new Date(values.endDate);
      end.setHours(eh, em, es);

      if (!serverAccessToken) throw new Error("No access token found");

      const res = await fetch("/api/schedules/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAccessToken}`,
        },
        body: JSON.stringify({
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          duration_minutes: values.durationMinutes,
          service_id: values.serviceId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        notify("error", err.message || "Tạo lịch hàng loạt thất bại.");
        return;
      }

      const result = await res.json();
      notify("success", `Tạo thành công ${result.created} lịch trống!`);
      batchForm.reset();
      setOpen(false);
      if (onScheduleCreated) onScheduleCreated();
    } catch (error) {
      console.error("Error submitting batch form:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      notify("error", errMsg || "Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDateTimePicker = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any,
    dateField: string,
    timeField: string,
    label: string,
    isStart: boolean
  ) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Popover
            open={isStart ? openStart : openEnd}
            onOpenChange={isStart ? setOpenStart : setOpenEnd}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-36 justify-between font-normal"
              >
                {form.watch(dateField)
                  ? format(form.watch(dateField), "dd/MM/yyyy")
                  : "Chọn ngày"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch(dateField)}
                captionLayout="dropdown"
                locale={vi}
                onSelect={(date) => {
                  form.setValue(dateField, date as Date);
                  if (isStart) setOpenStart(false);
                  else setOpenEnd(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors[dateField] && (
            <p className="text-sm text-red-500">
              {form.formState.errors[dateField].message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="time"
            step="1"
            {...form.register(timeField)}
            className="bg-background"
          />
          {form.formState.errors[timeField] && (
            <p className="text-sm text-red-500">
              {form.formState.errors[timeField].message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderServiceSelect = (form: any) => (
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
  );

  return (
    <div className="mb-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Tạo lịch mới</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo lịch tư vấn mới</DialogTitle>
          </DialogHeader>

          {/* Custom Tab Navigation */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "single"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Tạo từng lịch
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("batch")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "batch"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock className="h-4 w-4" />
              Tạo lịch liên tiếp
            </button>
          </div>

          {/* Single Schedule Form */}
          {activeTab === "single" && (
            <form
              onSubmit={singleForm.handleSubmit(onSubmitSingle)}
              className="grid gap-4 py-4"
            >
              {renderDateTimePicker(
                singleForm,
                "startDate",
                "startTime",
                "Ngày bắt đầu",
                true
              )}
              {renderDateTimePicker(
                singleForm,
                "endDate",
                "endTime",
                "Ngày kết thúc",
                false
              )}
              {renderServiceSelect(singleForm)}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : "Tạo lịch"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Batch Schedule Form */}
          {activeTab === "batch" && (
            <form
              onSubmit={batchForm.handleSubmit(onSubmitBatch)}
              className="grid gap-4 py-4"
            >
              {renderDateTimePicker(
                batchForm,
                "startDate",
                "startTime",
                "Thời gian bắt đầu",
                true
              )}
              {renderDateTimePicker(
                batchForm,
                "endDate",
                "endTime",
                "Thời gian kết thúc",
                false
              )}

              <div className="grid gap-2">
                <Label htmlFor="durationMinutes">
                  Thời lượng mỗi slot (phút)
                </Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min="15"
                  max="120"
                  step="15"
                  {...batchForm.register("durationMinutes", {
                    valueAsNumber: true,
                  })}
                  className="bg-background"
                />
                {batchForm.formState.errors.durationMinutes && (
                  <p className="text-sm text-red-500">
                    {batchForm.formState.errors.durationMinutes.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Thời lượng từ 15-120 phút, khuyến nghị: 30, 45, 60, 90 phút
                </p>
              </div>

              {renderServiceSelect(batchForm)}

              {/* Estimated slots preview */}
              {/* <div className="p-3 bg-blue-50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                  <Clock className="h-4 w-4" />
                  Dự kiến tạo: {calculateEstimatedSlots()} lịch trống
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Hệ thống sẽ tự động chia thành các slot {batchForm.watch("durationMinutes")} phút
                </p>
              </div> */}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Đang tạo..."
                    : `Tạo ${calculateEstimatedSlots()} lịch trống`}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
