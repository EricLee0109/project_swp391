import { BookingTrigger } from "@/components/healthServices/BookingTrigger";
import { DetailItem } from "@/components/healthServices/DetailItem";
import { consultantsData } from "@/data/consultants";
import { schedulesData } from "@/data/schedules";
import { servicesData } from "@/data/services";
import { slugify } from "@/lib/utils";
import { Home, Clock, Hospital, Info, Users } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ query: string }>;
}) {
  let slug = (await searchParams)?.query;
  console.log(slug, "slug from params");

  // Fallback for preview environment where props might not be passed
  if (!slug && typeof window !== "undefined") {
    const pathParts = window.location.pathname.split("/");
    const slugFromUrl = pathParts[pathParts.length - 1];
    if (slugFromUrl) {
      slug = slugFromUrl;
    }
  }

  const service =
    servicesData.find((s) => slugify(s.name) === slug) || servicesData[0];
  const consultants = consultantsData || [];
  const schedules = schedulesData || [];

  // Not found service handling
  if (!service) notFound();

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
                Service Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <DetailItem
                  icon={<Info size={24} />}
                  label="Status"
                  value={service.is_active ? "Currently Active" : "Not Active"}
                />
                <DetailItem
                  icon={<Users size={24} />}
                  label="Daily Capacity"
                  value={`${service.daily_capacity} appointments/day`}
                />
                <DetailItem
                  icon={<Clock size={24} />}
                  label="Testing Hours"
                  value={service.testing_hours}
                />
              </div>
            </div>

            {/* --- RIGHT COLUMN: Booking & Availability --- */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-medium text-gray-600">Price</p>
                  <p className="text-3xl font-bold text-teal-600">
                    ${(service.price / 100).toFixed(2)}
                  </p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Available At:
                  </h3>
                  <div className="space-y-3">
                    {service.available_modes.includes("AT_CLINIC") && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Hospital size={20} className="text-indigo-600" />
                        <span>In-Person at Clinic</span>
                      </div>
                    )}
                    {service.available_modes.includes("AT_HOME") && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Home size={20} className="text-teal-600" />
                        <span>At-Home Service</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* All client-side logic in this component */}
                <BookingTrigger
                  service={service}
                  consultants={consultants}
                  schedules={schedules}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
