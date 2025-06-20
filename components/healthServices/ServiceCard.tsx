import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { Service } from "@/types/ServiceType/HealthServiceType";
import { Home, Hospital } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {service.name}
        </h3>
        <span className="text-lg font-semibold text-primary">
          ${(service.price / 100).toFixed(2)}
        </span>
      </div>
      <p className="text-gray-600 mb-4 h-12">{service.description}</p>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="font-semibold mr-2">Category:</span>
        <span>{service.category}</span>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="font-semibold mr-2">Availability:</span>
        <div className="flex gap-3">
          {service.available_modes.includes("AT_HOME") && (
            <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
              <Home size={14} />
              <span>At Home</span>
            </div>
          )}
          {service.available_modes.includes("AT_CLINIC") && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
              <Hospital size={14} />
              <span>At Clinic</span>
            </div>
          )}
        </div>
      </div>

      <Button
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-500 transition-colors duration-300 mt-4"
        asChild
      >
        <Link
          href={`/sexualHealthServices/detail/?query=${slugify(service.name)}`}
        >
          Book Now
        </Link>
      </Button>
    </div>
  </div>
);
