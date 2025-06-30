import { auth } from "@/auth";
import { notify } from "@/lib/toastNotify";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (session && session.user.role === "Customer") redirect("/");
  notify("error", "Bạn không có quyền!");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Cannot access</h1>
    </div>
  );
}
