import { BookingTrigger } from "@/components/healthServices/BookingTrigger";
import { DetailItem } from "@/components/healthServices/DetailItem";
import { consultantsData } from "@/data/consultants"; // Dùng mock data tạm thời
import { schedulesData } from "@/data/schedules"; // Dùng mock data tạm thời
import { slugify } from "@/lib/utils";
import { Home, Clock, Hospital, Info, Users, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Service, AvailableModeEnums } from "@/types/ServiceType/HealthServiceType";

// Chú ý: searchParams luôn là object (không Promise)
// Fix kiểu cho chuẩn Next.js App Router:
export default async function ServiceDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ query: string}>;
}) {
    const params = await searchParams;
  const slug = params?.query;
  // Fetch all services từ API nội bộ trên server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/services`, {
    cache: "no-store", // Hoặc "force-cache" tuỳ app
  });
  if (!res.ok) {
    console.error("Fetch error:", await res.text());
    throw new Error("Failed to fetch services");
  }
const services: Service[] = await res.json();
const service: Service | undefined = services.find((s) => slugify(s.name) === slug);

  if (!service) notFound();

  // Optionally: fetch consultants/schedules API nếu có (hoặc lấy mock)
  const consultants = consultantsData || [];
  const schedules = schedulesData || [];

  // Format price thành VNĐ (nếu price là number)
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(service.price));


  type TestingHours = {
  morning?: { start: string; end: string };
  afternoon?: { start: string; end: string };
} | null;

  // Format testing_hours trên server
const formatTestingHours = (testingHours?: TestingHours): string => {
  if (!testingHours) {
    return (
      <>
        <div>
          <b>Ca sáng:</b> N/A
        </div>
        <div>
          <b>Ca chiều:</b> N/A
        </div>
      </>
    ) as unknown as string; // Trick để dùng với DetailItem cũ, nếu bạn muốn kiểu JSX, xem phần dưới!
  }
  const morning = testingHours.morning
    ? `${testingHours.morning.start} - ${testingHours.morning.end}`
    : "N/A";
  const afternoon = testingHours.afternoon
    ? `${testingHours.afternoon.start} - ${testingHours.afternoon.end}`
    : "N/A";

  return (
    <>
      <div>
        <b>Ca sáng:</b> {morning}
      </div>
      <div>
        <b>Ca chiều:</b> {afternoon}
      </div>
    </>
  ) as unknown as string;
};

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* --- LEFT COLUMN: Main Info --- */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                {service.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {service.category}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {service.type}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                {service.description}
              </p>

              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Dịch vụ chi tiết
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 ">
                <DetailItem
                  icon={<Info size={24} />}
                  label="Trang thái dịch vụ"
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

            {/* --- RIGHT COLUMN: Booking & Availability --- */}
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
                    Có thể khám:
                  </h3>
                  <div className="space-y-3">
                    {service.available_modes.includes(AvailableModeEnums.AT_CLINIC) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Hospital size={20} className="text-indigo-600" />
                        <span>Xét nghiệm tại bệnh viện</span>
                      </div>
                    )}
                    {service.available_modes.includes(AvailableModeEnums.AT_HOME) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Home size={20} className="text-teal-600" />
                        <span>Khám tại nhà</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* All client-side logic in this component */}
                <BookingTrigger
                  service={service}
                  consultants={consultants}
                  schedules={schedules}
                  // suppressHydrationWarning 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}