"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Hospital,
  CheckCircle2,
  Info,
  Users,
  Clock,
  Globe,
} from "lucide-react";
import { BookingTrigger } from "@/components/healthServices/BookingTrigger";
import { DetailItem } from "@/components/healthServices/DetailItem";
import {
  CustomService,
  Consultant,
} from "@/types/ServiceType/CustomServiceType";
import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";
import { getTypeBadgeVariant } from "@/components/dashboard/components/appointment/helpers";
import { Badge } from "@/components/ui/badge";

interface TestingHours {
  morning?: { start: string; end: string };
  afternoon?: { start: string; end: string };
}

export default function DetailService({
  serviceId,
  accessToken,
}: {
  serviceId: string;
  accessToken?: string | null;
}) {
  const [service, setService] = useState<CustomService | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        if (!res.ok) throw new Error("Không lấy được thông tin dịch vụ");
        const data = await res.json();
        setService({
          ...data.service,
          price: data.service.price,
          daily_capacity: data.service.daily_capacity ?? 0, // Gán 0 nếu null
          available_modes: data.service.available_modes.filter((mode: string) =>
            ["AT_HOME", "AT_CLINIC", "ONLINE"].includes(mode)
          ) as ("AT_HOME" | "AT_CLINIC" | "ONLINE")[],
        });
        setConsultants(data.consultants || []);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    if (serviceId) fetchDetail();
  }, [serviceId]);

  if (loading)
    return (
      <div className="p-10 text-center">
        <LoadingSkeleton />
      </div>
    );
  if (!service)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy dịch vụ.
      </div>
    );

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(parseInt(service.price, 10));

  const formatTestingHours = (testingHours?: TestingHours | null) => {
    if (!testingHours)
      return (
        <>
          <div>
            <b>Ca sáng:</b> Không có
          </div>
          <div>
            <b>Ca chiều:</b> Không có
          </div>
        </>
      );
    const morning = testingHours.morning
      ? `${testingHours.morning.start} - ${testingHours.morning.end}`
      : "Không có";
    const afternoon = testingHours.afternoon
      ? `${testingHours.afternoon.start} - ${testingHours.afternoon.end}`
      : "Không có";
    return (
      <>
        <div>
          <b>Ca sáng:</b> {morning}
        </div>
        <div>
          <b>Ca chiều:</b> {afternoon}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {service.name}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              {service.category}
            </span>
            <span>
              <Badge
                className={getTypeBadgeVariant(
                  service.type as "Consultation" | "Testing"
                )}
              >
                {service.type === "Consultation" ? "Tư vấn" : "Xét nghiệm"}
              </Badge>
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">
            {service.description}
          </p>

          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Chi tiết dịch vụ
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <DetailItem
              icon={<Info size={24} />}
              label="Trạng thái dịch vụ"
              value={
                service.is_active ? (
                  <div>
                    <span className="animate-pulse">
                      <CheckCircle2 size={20} className="icon-check" />
                    </span>
                    <span>Đang hoạt động</span>
                  </div>
                ) : (
                  "Tạm dừng"
                )
              }
            />
            <DetailItem
              icon={<Users size={24} />}
              label="Số lượng khách hàng"
              value={`${service.daily_capacity} lịch hẹn/ngày`}
            />
            <DetailItem
              icon={<Clock size={24} />}
              label="Giờ xét nghiệm"
              value={formatTestingHours(service.testing_hours)}
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-medium text-gray-600">Chi phí</p>
              <p className="text-3xl font-bold text-primary">
                {formattedPrice}
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Hình thức khám:
              </h3>
              <div className="space-y-3">
                {service.available_modes.includes("AT_CLINIC") && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hospital size={20} className="text-indigo-600" />
                    <span>Tại phòng khám</span>
                  </div>
                )}
                {service.available_modes.includes("AT_HOME") && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Home size={20} className="text-teal-600" />
                    <span>Tại nhà</span>
                  </div>
                )}
                {service.available_modes.includes("ONLINE") && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={20} className="text-teal-600" />
                    <span>Trực tuyến</span>
                  </div>
                )}
              </div>
            </div>
            <BookingTrigger
              accessToken={accessToken}
              service={service}
              consultants={consultants}
              schedules={consultants.flatMap((c) => c.schedules || [])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
