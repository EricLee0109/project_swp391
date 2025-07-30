"use client";

import { StiTestBookingForm } from "@/components/healthServices/appoinmentBookingType/StiServiceForm";
import { notify } from "@/lib/toastNotify";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Loader2, Users, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  CustomService,
  Consultant,
  Schedule,
  CreateAppointmentDto,
} from "@/types/ServiceType/CustomServiceType";
import { Button } from "@/components/ui/button";

export function BookingModal({
  service,
  consultants,
  schedules,
  onClose,
}: {
  service: CustomService;
  consultants: Consultant[];
  schedules: Schedule[];
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState<Partial<CreateAppointmentDto>>(
    {
      service_id: service.service_id,
      type: service.type,
      test_code: null,
      location: "Tại phòng khám",
      mode: undefined, // Thêm field mode
    }
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [stiAppointmentId, setStiAppointmentId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleModeSelect = (mode: "AT_CLINIC" | "ONLINE") => {
    setAppointment((prev) => ({
      ...prev,
      mode,
      location: mode === "AT_CLINIC" ? "Tại phòng khám" : "Tư vấn online",
    }));
    setStep(2);
  };

  const handleConsultantSelect = (consultant: Consultant) => {
    setAppointment((prev) => ({
      ...prev,
      consultant_id: consultant.consultant_id,
    }));
    setStep(3);
  };

  const handleScheduleSelect = (schedule: Schedule, time: string) => {
    setAppointment((prev) => ({ ...prev, schedule_id: schedule.schedule_id }));
    setSelectedTime(time);
    setSelectedDate(schedule.start_time);
    setStep(4);
  };

  const createAppointment = async () => {
    setLoading(true);
    if (
      !appointment.consultant_id ||
      !appointment.schedule_id ||
      !appointment.location ||
      !appointment.mode
    ) {
      notify(
        "error",
        "Vui lòng hoàn thành tất cả các bước trước khi đặt lịch."
      );
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointment,
          test_code: stiAppointmentId || appointment.test_code,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }
        throw new Error("Không thể tạo lịch hẹn");
      }
      const responseData = await response.json();

      notify("success", "Đặt lịch hẹn thành công!");

      if (stiAppointmentId) {
        // If stiAppointmentId is provided (assumed valid), redirect to /profile/order
        window.location.href = "/profile/order";
      } else {
        // If no stiAppointmentId, redirect to checkoutUrl if available
        const checkoutUrl = responseData.data?.paymentLink;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          window.location.href = "/profile/order"; // Fallback if no checkoutUrl
        }
      }
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo lịch hẹn:", error);
      notify("error", "Không thể tạo lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const selectedConsultant = consultants.find(
    (c) => c.consultant_id === appointment.consultant_id
  );
  const consultantSchedules = schedules.filter((s) =>
    consultants
      .find((c) => c.consultant_id === appointment.consultant_id)
      ?.schedules.some((sch) => sch.schedule_id === s.schedule_id)
  );

  if (service.type === "Testing") {
    return (
      <StiTestBookingForm
        service={service}
        onClose={onClose}
        setStiAppointmentId={setStiAppointmentId}
      />
    );
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
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Step 1: Chọn hình thức tư vấn */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Chọn hình thức tư vấn
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              <div
                onClick={() => handleModeSelect("AT_CLINIC")}
                className="flex items-center p-6 border-2 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-teal-500 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-teal-200">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tại phòng khám</h3>
                  <p className="text-sm text-gray-600">
                    Gặp trực tiếp tư vấn viên tại phòng khám
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleModeSelect("ONLINE")}
                className="flex items-center p-6 border-2 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tư vấn online</h3>
                  <p className="text-sm text-gray-600">
                    Tư vấn qua video call từ xa
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chọn tư vấn viên */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Chọn tư vấn viên
            </h2>
            <div className="mb-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {appointment.mode === "AT_CLINIC" ? (
                  <>
                    <Users className="w-4 h-4 mr-1" />
                    Tại phòng khám
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-1" />
                    Tư vấn online
                  </>
                )}
              </span>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {consultants.map((c) => (
                <div
                  key={c.consultant_id}
                  onClick={() => handleConsultantSelect(c)}
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHfd3PPulVSp4ZbuBFNkePoUR_fLJQe474Ag&s"
                    alt={c.full_name || ""}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-bold">{c.full_name}</p>
                    <p className="text-sm text-gray-500">{c.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Chọn thời gian */}
        {step === 3 && selectedConsultant && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Chọn thời gian tư vấn
            </h2>
            <div className="mb-4 text-center space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {appointment.mode === "AT_CLINIC" ? (
                  <>
                    <Users className="w-4 h-4 mr-1" />
                    Tại phòng khám
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-1" />
                    Tư vấn online
                  </>
                )}
              </span>
              <h3 className="text-lg font-semibold">
                {selectedConsultant.full_name}
              </h3>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {consultantSchedules.length > 0 ? (
                consultantSchedules.map((s) => (
                  <div key={s.schedule_id} className="p-4 border rounded-lg">
                    <p className="font-bold mb-2">
                      {formatDate(new Date(s.start_time))}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleScheduleSelect(s, s.start_time)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                      >
                        {`${new Date(s.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(s.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Không có lịch hẹn nào cho tư vấn viên này.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Xác nhận lịch hẹn */}
        {step === 4 && selectedConsultant && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Xác nhận lịch hẹn
            </h2>
            <div className="space-y-3 text-gray-700 p-4 bg-gray-50 rounded-lg border">
              <p>
                <span>Dịch vụ:</span>{" "}
                <span className="font-bold">{service.name}</span>
              </p>
              <p>
                <span>Hình thức:</span>{" "}
                <span className="font-bold inline-flex items-center">
                  {appointment.mode === "AT_CLINIC" ? (
                    <>
                      <Users className="w-4 h-4 mr-1" />
                      Tại phòng khám
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-1" />
                      Tư vấn online
                    </>
                  )}
                </span>
              </p>
              <p>
                <span>Tư vấn viên:</span>{" "}
                <span className="font-bold">
                  {selectedConsultant.full_name}
                </span>
              </p>
              <p>
                <span>Ngày:</span>{" "}
                <span className="font-bold">
                  {formatDate(new Date(selectedDate))}
                </span>
              </p>
              <p>
                <span>Giờ:</span>{" "}
                <span className="font-bold">
                  {`${new Date(selectedTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(
                    consultantSchedules.find(
                      (s) => s.schedule_id === appointment.schedule_id
                    )?.end_time || ""
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </span>
              </p>
              <div className="space-y-2">
                <label htmlFor="stiAppointmentId" className="font-semibold">
                  Mã lịch hẹn STI (nếu muốn tư vấn miễn phí):
                </label>
                <input
                  id="stiAppointmentId"
                  type="text"
                  value={stiAppointmentId}
                  onChange={(e) => setStiAppointmentId(e.target.value)}
                  placeholder="Nhập mã lịch hẹn STI (nếu có)"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                onClick={createAppointment}
                disabled={loading}
                type="submit"
                className="w-1/2 bg-primary mr-0 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 hover:text-red-100 transition-colors duration-300 shadow-lg"
              >
                {!loading ? (
                  <div>Đặt lịch</div>
                ) : (
                  <div>
                    <Loader2 size={15} className="animate-spin" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
