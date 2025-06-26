import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/healthServices/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authJWT } from "@/lib/auth";
import Header from "@/components/dashboard/header";
import { servicesData } from "@/data/services";

export default async function HealthServicesListPage() {
  const data = servicesData;
  const userSession = await authJWT();
  const { fullName } = userSession?.user || {};

  return (
    <div>
      <Header
        title="Quản lý dịch vụ sức khỏe"
        href="/dashboard/healthServices/view"
        currentPage="Theo dõi dịch vụ sức khỏe"
      />
      <div className="container mx-auto p-6">
        <div className="ml-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Theo dõi dịch vụ sức khỏe
            </h1>
            <p className="text-muted-foreground">
              Được giám sát bởi - {fullName}.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Các cuộc hẹn</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Note: I'm reusing the AppointmentDataTable. You might want to rename it to just "DataTable" to reflect its generic nature. */}
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
