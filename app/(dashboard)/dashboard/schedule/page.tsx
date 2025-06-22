import { cookies } from "next/headers";
import SchuldesPageClient from "./SchuldesPageClient";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const serverTime = new Date().toISOString();

  return (
    <SchuldesPageClient accessToken={accessToken} serverTime={serverTime} />
  );
}
