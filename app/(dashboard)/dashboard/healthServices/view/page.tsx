// HealthServicesView.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { Skeleton } from "@/components/ui/skeleton";

import { notify } from "@/lib/toastNotify";
import HealthServicesForm from "@/components/dashboard/components/healthServices/HealthServicesForm";
import HealthServicesTable from "@/components/dashboard/components/healthServices/HealthServicesTable";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";

export default function HealthServicesView() {
  const [services, setServices] = useState<ServicesListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<
    ServicesListType | undefined
  >(undefined);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setServices(data || []);
        } else {
          setError(data?.error || "Không thể tải danh sách dịch vụ.");
          notify("error", "Không thể tải danh sách dịch vụ.");
        }
      } catch {
        setError("Lỗi mạng. Vui lòng thử lại.");
        notify("error", "Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateServices = (updatedServices: ServicesListType[]) => {
    setServices(updatedServices);
    setServiceToEdit(undefined);
    // notify("success","Cập nhật danh sách dịch vụ thành công");
  };

  if (loading) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="py-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-end mb-4">
              <HealthServicesForm
                isOpen={isCreateDialogOpen}
                onClose={() => {
                  setIsCreateDialogOpen(false);
                  setServiceToEdit(undefined);
                }}
                onSave={handleUpdateServices}
                services={services}
                setIsOpen={setIsCreateDialogOpen}
                serviceToEdit={serviceToEdit}
              />
            </div>
            <HealthServicesTable
              services={paginatedServices}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onUpdateServices={handleUpdateServices}
              setIsCreateDialogOpen={setIsCreateDialogOpen}
              setServiceToEdit={setServiceToEdit}
            />
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
