// app/(consultant)/dashboard/profile/page.tsx

import ProfileDashboard from "@/components/dashboard/components/profile-dashboard/ProfileDashboardProps";
import Header from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Quản lý hồ sơ"
        href="/dashboard/profile"
        currentPage="Hồ sơ tư vấn viên"
      />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-end">
          <Link href="/manager/dashboard/update-profile">
            <Button className="flex gap-2 items-center">Cập nhật hồ sơ</Button>
          </Link>
        </div>

        {/* Không cần truyền prop nếu ProfileDashboard tự fetch */}
        <ProfileDashboard />
      </div>
    </div>
  );
}
