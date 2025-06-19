"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

 interface ProfileType {
  profile_id: string;
  user_id: string;
  full_name: string;
  address: string | null;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  medical_history?: string;
  privacy_settings: {
    shareData: boolean;
    showEmail: boolean;
  };
}

export default function ProfileViewer() {
 const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile/customer", {
        credentials: "include", 
      });
      const data = await res.json();

      console.log("GET profile", res.status, data);

      if (res.ok) {
        setProfile(data);
      } else {
        console.error("Không thể tải hồ sơ:", data?.error);
      }
    } catch (err) {
      console.error("Lỗi mạng khi tải hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, []);

  console.log("profile", profile);
  
  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (!profile) {
    return <p className="text-center text-red-500">Không thể tải hồ sơ người dùng.</p>;
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-xl">Hồ sơ của tôi</CardTitle>
        <p className="text-sm text-muted-foreground">Thông tin cá nhân</p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Họ tên</p>
            <p className="font-medium">{profile.full_name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Địa chỉ</p>
            <p className="font-medium">{profile.address}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Ngày sinh</p>
            <p className="font-medium flex items-center gap-1">
              {profile.date_of_birth ? formatDate(new Date(profile.date_of_birth)) : ""}
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Giới tính</p>
            <p className="font-medium">{profile.gender}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Tiền sử bệnh</p>
            <p className="font-medium">{profile.medical_history || "Không có"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Chia sẻ dữ liệu</p>
            <p className="font-medium">
              {profile.privacy_settings?.shareData ? "Có" : "Không"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Hiển thị email công khai</p>
            <p className="font-medium">
              {profile.privacy_settings?.showEmail ? "Có" : "Không"}
            </p>
          </div>
        </div>

        {/* Cột phải: Ảnh đại diện */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="https://github.com/shadcn.png"
            alt="Avatar"
            width={144}
            height={144}
            className="rounded-full border object-cover"
          />
          <p className="text-sm text-muted-foreground">Ảnh đại diện (demo)</p>
        </div>
      </CardContent>
    </Card>
  );
}
