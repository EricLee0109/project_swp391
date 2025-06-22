import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/shipping/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shippingData } from "@/data/shippings";
import { authJWT } from "@/lib/auth";

export default async function ShippingTrackingPage() {
  const data = shippingData;
  const userSession = await authJWT();
  const { fullName } = userSession?.user || {};

  return (
    <div className="container mx-auto py-10">
      <div className="ml-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Theo dõi đơn vận chuyển
          </h1>
          <p className="text-muted-foreground">
            Được giám sát bởi - {fullName}.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Các đơn vận chuyển</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Note: I'm reusing the AppointmentDataTable. You might want to rename it to just "DataTable" to reflect its generic nature. */}
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
