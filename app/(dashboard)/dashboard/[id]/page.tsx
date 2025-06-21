import { authJWT } from "@/lib/auth";
import { UserAuth } from "@/types/ServiceType/HealthServiceType";

//Add Params if needed
export default async function DashboardPage() {
  const userSession = await authJWT();
  // const role = userSession?.user?.role; // Safely get the role
  const { email, fullName, role } = userSession?.user || {};

  return <div>This is Dashboard Page {fullName} </div>;
}
