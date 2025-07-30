"use client";

import { getTypeBadgeVariant } from "@/components/dashboard/components/appointment/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomService } from "@/types/ServiceType/CustomServiceType";
import { Globe, Home, Hospital } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: CustomService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Format price to VND
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(parseInt(service.price, 10));

  return (
    <div className="bg-white rounded-2xl shadow-lg border-red-200 overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {service.name}
          </h3>
          <span className="text-lg font-semibold text-primary">
            {formattedPrice}
          </span>
        </div>
        <p className="text-gray-600 mb-4 h-12">{service.description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
          <span className="font-semibold mr-2">Loại:</span>
          <span className="line-clamp-1">{service.category}</span>
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

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-semibold mr-2">Hình thức:</span>
          <div className="flex gap-2">
            {service.available_modes.includes("AT_HOME") && (
              <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs">
                <Home size={14} />
                <span>Tại nhà</span>
              </div>
            )}
            {service.available_modes.includes("AT_CLINIC") && (
              <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                <Hospital size={14} />
                <span>Tại phòng khám</span>
              </div>
            )}
            {service.available_modes.includes("ONLINE") && (
              <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs">
                <Globe size={14} />
                <span>Trực tuyến</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-24 overflow-hidden bg-gray-50">
        <Button
          className="w-full bg-primary text-white font-bold rounded-sm hover:bg-primary-100 hover:text-primary-500 transition-colors duration-300"
          asChild
        >
          <Link
            href={`/sexualHealthServices/detail?service_id=${service.service_id}`}
          >
            Chi tiết
          </Link>
        </Button>
      </div>
    </div>
  );
};
