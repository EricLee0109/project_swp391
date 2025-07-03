// app/(consultant)/dashboard/profile/page.tsx

import Header from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

import ProfileDashboard from "@/components/dashboard/components/profile-dashboard/ProfileDashboardProps";
import { getMyConsultantProfile } from "@/app/api/dashboard/profile-dashboard/action";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const isConsultant = user?.role === "Consultant";

  const consultantProfile = await getMyConsultantProfile();

  console.log(consultantProfile, "consultantProfileee");

  return (
    <div>
      <Header
        title="Quản lý hồ sơ"
        href="/dashboard/profile"
        currentPage="Hồ sơ tư vấn viên"
      />

      <div className="container mx-auto p-6 space-y-6">
        {isConsultant && (
          <div className="flex justify-end">
            <Link href="/consultant/dashboard/UpdateProfilePage">
              <Button className="flex gap-2 items-center">
                <Plus className="w-4 h-4" />
                Tạo mới
              </Button>
            </Link>
          </div>
        )}

        <ProfileDashboard profile={consultantProfile} />
      </div>
    </div>
  );
}
