
"use client";

import { FilterPill } from "@/components/healthServices/FilterPill";
import { ServiceCard } from "@/components/healthServices/ServiceCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

// Import enums and types
import {
  Service,
  ServiceTypeEnums,
  AvailableModeEnums,
} from "@/types/ServiceType/HealthServiceType";
import Loading from "@/app/(root)/loading";

type RawService = Omit<Service, "price"> & { price: string };

export function ServiceBrowser() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: RawService[] = await res.json();
        console.log("Fetched services:", data);
        const activeServices: Service[] = data
          .filter((service) => service.is_active)
          .map((service) => ({
            ...service,
            price: service.price,
            type: service.type as ServiceTypeEnums,
            available_modes: service.available_modes as AvailableModeEnums[],
            daily_capacity: service.daily_capacity ?? 0, // Gán 0 nếu null
          }));
        setServices(activeServices);
        setError(null);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Không thể tải danh sách dịch vụ.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories: string[] = [
    "All",
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  const filteredServices = services
    .filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (service) => activeFilter === "All" || service.category === activeFilter
    );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="mb-10 px-4 md:px-0">
        <div className="relative max-w-2xl mx-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow duration-300 font-work-sans"
          />
        </div>
      </div>

      <div className="mb-10 flex justify-center flex-wrap gap-3">
        {categories.map((category) => (
          <FilterPill
            key={category}
            label={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.service_id}
              service={{
                ...service,
                type: service.type as string, // Chuyển type để khớp với CustomService
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-500 text-lg">
              No services found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
