"use client";

import { notify } from "@/lib/toastNotify";
import { formatDate } from "@/lib/utils";
import {
  StiFormServiceValues,
  stiFormServiceSchema,
} from "@/types/schemas/FormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Hospital } from "lucide-react";
import { useForm } from "react-hook-form";
import { CustomService, CreateAppointmentDto } from "@/types/ServiceType/CustomServiceType";

export function StiTestBookingForm({
  service,
  onClose,
}: {
  service: CustomService;
  onClose: () => void;
}) {
  const form = useForm<StiFormServiceValues>({
    resolver: zodResolver(stiFormServiceSchema),
    defaultValues: {
      serviceId: service.service_id,
      selected_mode: service.available_modes[0] ?? "AT_CLINIC",
      date: undefined,
      session: undefined,
      contact_name: undefined,
      contact_phone: undefined,
      shipping_address: undefined,
    },
  });

  const selectedMode = form.watch("selected_mode");

  async function onSubmit(data: StiFormServiceValues) {
    const payload: CreateAppointmentDto = {
      service_id: data.serviceId,
      type: service.type,
      location: data.selected_mode === "AT_HOME" ? "Tại nhà" : service.return_address || "Tại phòng khám",
      related_appointment_id: null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      shipping_address: data.shipping_address,
      consultant_id: "default-consultant",
      schedule_id: `${data.serviceId}-${formatDate(data.date)}-${data.session}`,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Không thể đặt lịch xét nghiệm STI");
      notify("success", "Đặt lịch xét nghiệm STI thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi đặt lịch xét nghiệm STI:", error);
      notify("error", "Không thể đặt lịch xét nghiệm STI. Vui lòng thử lại.");
    }
  }

  return (
    <div className="form-container">
      <div className="form-container-inner">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Đặt lịch xét nghiệm STI: {service.name}
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-3"
        >
          <div className="space-y-2">
            <label className="font-semibold">Hình thức dịch vụ</label>
            <div className="flex gap-4">
              {service.available_modes.map((mode) => (
                <label
                  key={mode}
                  className={`flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 ${
                    selectedMode === mode ? "border-teal-500 bg-teal-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    {...form.register("selected_mode")}
                    value={mode}
                    className="hidden"
                  />
                  {mode === "AT_CLINIC" ? (
                    <Hospital size={20} />
                  ) : (
                    <Home size={20} />
                  )}
                  <span>{mode === "AT_CLINIC" ? "Tại phòng khám" : "Tại nhà"}</span>
                </label>
              ))}
            </div>
            {form.formState.errors.selected_mode && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.selected_mode.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="font-semibold">
                Ngày
              </label>
              <input
                id="date"
                type="date"
                {...form.register("date")}
                className="w-full p-2 border rounded-md"
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Buổi</label>
              <select
                {...form.register("session")}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Chọn buổi</option>
                <option value="morning">Buổi sáng</option>
                <option value="afternoon">Buổi chiều</option>
              </select>
              {form.formState.errors.session && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.session.message}
                </p>
              )}
            </div>
          </div>

          {selectedMode === "AT_HOME" && (
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-4">
                Chi tiết dịch vụ tại nhà
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact_name" className="font-semibold">
                    Tên liên hệ
                  </label>
                  <input
                    id="contact_name"
                    {...form.register("contact_name")}
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.contact_name && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contact_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="font-semibold">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    id="contact_phone"
                    {...form.register("contact_phone")}
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.contact_phone && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contact_phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="shipping_address" className="font-semibold">
                  Địa chỉ giao hàng
                </label>
                <input
                  id="shipping_address"
                  {...form.register("shipping_address")}
                  placeholder="123 Đường Chính"
                  className="w-full p-2 border rounded-md"
                />
                {form.formState.errors.shipping_address && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.shipping_address.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-lg"
          >
            Đặt lịch xét nghiệm
          </button>
        </form>
      </div>
    </div>
  );
}