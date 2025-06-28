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
import { CustomService, CreateStiAppointmentDto } from "@/types/ServiceType/CustomServiceType";

export function StiTestBookingForm({
  service,
  onClose,
  setStiAppointmentId,
}: {
  service: CustomService;
  onClose: () => void;
  setStiAppointmentId: (id: string) => void;
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
      province: undefined,
      district: undefined,
      ward: undefined,
    },
  });

  const selectedMode = form.watch("selected_mode");

  async function onSubmit(data: StiFormServiceValues) {
    const payload: CreateStiAppointmentDto = {
      serviceId: data.serviceId,
      date: formatDate(data.date),
      session: data.session,
      location: data.selected_mode === "AT_HOME" ? "Tại nhà" : service.return_address || "Tại phòng khám",
      category: "STI",
      selected_mode: data.selected_mode,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      shipping_address: data.shipping_address,
      province: data.province,
      district: data.district,
      ward: data.ward,
    };

    try {
      const response = await fetch("/api/appointments/sti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          notify("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }
        throw new Error("Không thể đặt lịch xét nghiệm STI");
      }

      const responseData = await response.json();
      const appointmentId = responseData.data?.appointment?.appointment_id;
      if (appointmentId) {
        setStiAppointmentId(appointmentId);
        notify("success", `Đặt lịch xét nghiệm STI thành công! Mã lịch hẹn: ${appointmentId}`);
      } else {
        notify("success", "Đặt lịch xét nghiệm STI thành công!");
      }
      const checkoutUrl = responseData.data?.paymentLink?.checkoutUrl;
      if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return; 
    }
      onClose();
    } catch (error) {
      console.error("Lỗi khi đặt lịch xét nghiệm STI:", error);
      notify("error", "Không thể đặt lịch xét nghiệm STI. Vui lòng thử lại.");
    }
  }

  return (
    <div className="form-container mt-16">
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
                <div className="space-y-2">
                  <label htmlFor="province" className="font-semibold">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    id="province"
                    {...form.register("province")}
                    placeholder="VD: TP.HCM"
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.province && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.province.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="district" className="font-semibold">
                    Quận/Huyện
                  </label>
                  <input
                    id="district"
                    {...form.register("district")}
                    placeholder="VD: Quận 1"
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.district && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.district.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="ward" className="font-semibold">
                    Phường/Xã
                  </label>
                  <input
                    id="ward"
                    {...form.register("ward")}
                    placeholder="VD: Phường 1"
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.ward && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.ward.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="shipping_address" className="font-semibold">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    id="shipping_address"
                    {...form.register("shipping_address")}
                    placeholder="VD: 123 Đường Chính"
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.shipping_address && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.shipping_address.message}
                    </p>
                  )}
                </div>
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