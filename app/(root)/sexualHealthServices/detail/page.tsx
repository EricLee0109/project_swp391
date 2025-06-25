import DetailService from "@/components/healthServices/DetailService";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ service_id?: string }>; // Update type to Promise
}) {
  const params = await searchParams; // Await searchParams
  const serviceId = params?.service_id;

  if (!serviceId) {
    return notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <DetailService serviceId={serviceId} />
      </main>
    </div>
  );
}
