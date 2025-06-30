import SchuldesPageClient from "./SchuldesPageClient";
import { auth } from "@/auth";

export default async function SchedulePage() {
  const session = await auth();
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value || "";
  const serverTime = new Date().toISOString();

  return (
    <SchuldesPageClient
      accessToken={session?.accessToken || ""}
      serverTime={serverTime}
    />
  );
}
