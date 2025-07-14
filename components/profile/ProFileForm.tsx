"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { CustomerDetailResponse } from "@/types/user/User";

export default function ProfileViewer() {
  const [profile, setProfile] = useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) throw new Error("Lỗi khi fetch profile");
        const data: CustomerDetailResponse = await res.json();
        setProfile(data);
        console.log("Profile data:", data);
      } catch (err) {
        console.error("Lỗi:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (!profile || !profile.customerProfile) {
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">
          Không thể tải hồ sơ người dùng.
        </p>
      </Card>
    );
  }

  const customer = profile.customerProfile;
  const avatarUrl =
    customer.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      customer.user.full_name
    )}`;

  return (
    <div className="py-5">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">Hồ sơ của tôi</CardTitle>
          <p className="text-sm text-muted-foreground">Thông tin cá nhân</p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Info label="Họ tên" value={customer.user.full_name} />
            <Info label="Địa chỉ" value={customer.user.address} />
            <Info
              label="Ngày sinh"
              value={formatDate(new Date(customer.date_of_birth))}
              icon={<CalendarIcon className="w-4 h-4 text-muted-foreground" />}
            />
            <Info
              label="Giới tính"
              value={
                customer.gender === "Male"
                  ? "Nam"
                  : customer.gender === "Female"
                  ? "Nữ"
                  : "Khác"
              }
            />

            <Info label="Tiền sử bệnh" value={customer.medical_history} />
            {/* <Info
              label="Hiển thị tên"
              value={customer.privacy_settings.showFullName ? "Có" : "Không"}
            /> */}
          </div>

          <div className="flex flex-col items-center gap-2">
            <Image
              src={customer.user.image || avatarUrl}
              alt="avatar"
              width={144}
              height={144}
              className="rounded-full object-cover border"
            />
            <p className="text-sm text-muted-foreground">Ảnh đại diện</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium flex items-center gap-1">
        {value} {icon}
      </p>
    </div>
  );
}
