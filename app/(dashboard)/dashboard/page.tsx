import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (session && session.user.role === "Customer") redirect("/");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
    </div>
  );
}
