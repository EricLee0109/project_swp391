"use client";

import { notify } from "@/lib/toastNotify";
import { formatDate } from "@/lib/utils";
import {
  StiFormServiceValues,
  stiFormServiceSchema,
} from "@/types/schemas/FormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Hospital, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CustomService,
  CreateStiAppointmentDto,
} from "@/types/ServiceType/CustomServiceType";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationType {
  code: string;
  name: string;
  label: string;
  path: string;
  name_with_type?: string;
  parent_code: string;
  path_with_type?: string;
  slug?: string;
  type?: string;
}

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedMode = form.watch("selected_mode");

  // State for location data
  const [provinces, setProvinces] = useState<LocationType[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districts, setDistricts] = useState<LocationType[]>([]);
  const [wards, setWards] = useState<LocationType[]>([]);

  async function onSubmit(data: StiFormServiceValues) {
    setIsSubmitting(true);

    //Convert province, district, and ward codes to names
    const convertedProvince = provinces.find(
      (province) => province.code === data.province
    );
    const convertedDistrict = districts.find(
      (district) => district.code === data.district
    );
    const convertedWard = wards.find((ward) => ward.code === data.ward);

    const payload: CreateStiAppointmentDto = {
      serviceId: data.serviceId,
      date: formatDate(data.date),
      session: data.session,
      location:
        data.selected_mode === "AT_HOME"
          ? "Tại nhà"
          : service.return_address || "Tại phòng khám",
      category: "STI",
      selected_mode: data.selected_mode,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      shipping_address: data.shipping_address,
      province: convertedProvince?.name,
      district: convertedDistrict?.name,
      ward: convertedWard?.name,
    };

    try {
      const response = await fetch("/api/appointments/sti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Không thể lưu thiết lập!");
      }

      const appointmentId = responseData.data?.appointment?.appointment_id;
      if (appointmentId) {
        setStiAppointmentId(appointmentId);
        notify(
          "success",
          `Đặt lịch xét nghiệm STI thành công! Mã lịch hẹn: ${appointmentId}`
        );
      } else {
        notify("success", "Đặt lịch xét nghiệm STI thành công!");
      }

      const checkoutUrl = responseData.data?.paymentLink;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      onClose();
    } catch (error) {
      console.error("Lỗi khi đặt lịch xét nghiệm STI:", error);
      notify("error", (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  //Select location handler
  useEffect(() => {
    // Fetch provinces data from external API
    const fetchProvinces = async () => {
      if (provinces.length > 0) return; // Avoid fetching if already loaded
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json"
        );
        const data: Record<string, LocationType> = await response.json();
        const mapper: LocationType[] = Object.values(data).map((e) => ({
          code: e?.code,
          name: e?.name,
          label: e?.name,
          path: e?.path, // Ensure 'path' is included
          name_with_type: e?.name_with_type, // Include 'name_with_type' if
          parent_code: e?.parent_code, // Include 'parent_code' if needed
        }));
        setProvinces(mapper);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, [provinces.length]);
  console.log(provinces, "provinces");

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan_huyen.json"
          );
          const data: Record<string, LocationType> = await response.json();

          const districtsData = Object.values(data).filter((district) =>
            district?.parent_code.includes(selectedProvince)
          );
          const mapper: LocationType[] = districtsData.map((e) => {
            return {
              code: e?.code,
              name: e?.name,
              label: e?.name,
              path: e?.path, // Ensure 'path' is included
              name_with_type: e?.name_with_type, // Include 'name_with_type' if
              parent_code: e?.parent_code, // Include 'parent_code' if needed
            };
          });
          setDistricts(mapper);
        } catch (e) {
          console.error("Error fetching districts:", e);
        }
      } else {
        setDistricts([]);
        setWards([]);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/xa_phuong.json"
          );
          const data: Record<string, LocationType> = await response.json();

          const wardsData = Object.values(data).filter((ward) =>
            ward.parent_code.includes(selectedDistrict)
          );
          const mapper: LocationType[] = wardsData.map((e) => {
            return {
              code: e?.code,
              name: e?.name,
              label: e?.name,
              path: e?.path, // Ensure 'path' is included
              name_with_type: e?.name_with_type, // Include 'name_with_type' if
              parent_code: e?.parent_code, // Include 'parent_code' if needed
            };
          });
          setWards(mapper);
        } catch (e) {
          console.error("Error fetching wards:", e);
        }
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  console.log(selectedProvince, "selectedProvince");
  console.log(selectedDistrict, "selectedDistrict");

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
                  <span>
                    {mode === "AT_CLINIC" ? "Tại phòng khám" : "Tại nhà"}
                  </span>
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
                <option value="morning">Buổi sáng (7:00 AM - 11:00 AM)</option>
                <option value="afternoon">
                  Buổi chiều (1:00 PM - 5:00 PM)
                </option>
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
                  <Select
                    value={form.watch("province") || ""}
                    onValueChange={(value) => {
                      form.setValue("province", value);
                      setSelectedProvince(value);
                      setSelectedDistrict(null);
                      form.setValue("district", "");
                      form.setValue("ward", "");
                    }}
                  >
                    <SelectTrigger
                      className="w-full p-2 border rounded-md"
                      id="province"
                    >
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto bg-white">
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name_with_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={form.watch("district") || ""}
                    onValueChange={(value) => {
                      form.setValue("district", value);
                      setSelectedDistrict(value);
                      form.setValue("ward", "");
                    }}
                    disabled={!districts.length}
                  >
                    <SelectTrigger
                      className="w-full p-2 border rounded-md"
                      id="district"
                    >
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto bg-white">
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name_with_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={form.watch("ward") || ""}
                    onValueChange={(value) => form.setValue("ward", value)}
                    disabled={!wards.length}
                  >
                    <SelectTrigger
                      className="w-full p-2 border rounded-md"
                      id="ward"
                    >
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto bg-white">
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name_with_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          <div className="flex justify-end">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-1/2 bg-primary mr-0 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 hover:text-red-100 transition-colors duration-300 shadow-lg"
            >
              {!isSubmitting ? (
                <div>Đặt lịch xét nghiệm</div>
              ) : (
                <div>
                  <Loader2 size={15} className="animate-spin" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
