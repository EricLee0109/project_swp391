import { auth } from "@/auth";
import DetailService from "@/components/healthServices/DetailService";
import Breadcrumb from "@/components/share/Breadcrumb";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ service_id?: string }>; // Update type to Promise
}) {
  const authUser = await auth();
  const accessToken = authUser?.accessToken;

  const params = await searchParams; // Await searchParams
  const serviceId = params?.service_id;

  if (!serviceId) {
    return notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Dịch vụ sức khỏe", href: "/sexualHealthServices" },
          { label: "Chi tiết", href: "/sexualHealthServices/detail" },
        ]}
      />
      <div className="bg-gray-50 min-h-screen font-sans">
        <main className="container mx-auto px-4 py-8 md:py-12">
          <DetailService
            accessToken={accessToken || null}
            serviceId={serviceId}
          />
        </main>
      </div>
    </>
  );
}
