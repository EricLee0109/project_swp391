import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/appointment/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authJWT } from "@/lib/auth";
import { appointmentData } from "@/data/appointment";
import Header from "@/components/dashboard/header";

export default async function AppointmentListPage() {
  const data = appointmentData;
  const userSession = await authJWT();
  const { fullName } = userSession?.user || {};

  return (
    <div>
      <Header
        title="Quản lý cuộc hẹn"
        href="/dashboard/appointment/view"
        currentPage="Theo dõi cuộc hẹn"
      />
       <div className="container mx-auto p-6"> 
 
      <div className="ml-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Theo dõi cuộc hẹn
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
