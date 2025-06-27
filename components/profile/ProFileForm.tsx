"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface ProfileType {
  profileId: string;
  userId: string;
  fullName: string;
  address: string | null;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  medicalHistory?: string;
  avatar?: string;
  privacySettings: {
    shareData: boolean;
    showEmail: boolean;
  };
}
//
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

        if (res.ok) {
          const mappedProfile: ProfileType = {
            profileId: data.profile_id,
            userId: data.user_id,
            fullName: data.full_name,
            address: data.address,
            dateOfBirth: data.date_of_birth,
            gender: data.gender,
            medicalHistory: data.medical_history,
            avatar: data.avatar,
            privacySettings: {
              shareData: data.privacy_settings?.shareData ?? false,
              showEmail: data.privacy_settings?.showEmail ?? false,
            },
          };

          setProfile(mappedProfile);
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
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">
          Không thể tải hồ sơ người dùng.
        </p>
      </Card>
    );
  }

  const avatarUrl =
    profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}`;

  return (
    <div className="py-5">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">Hồ sơ của tôii</CardTitle>
          <p className="text-sm text-muted-foreground">Thông tin cá nhân</p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin bên trái */}
          <div className="space-y-4">
            <Info label="Họ tên" value={profile.fullName || "Chưa có"} />
            <Info label="Địa chỉ" value={profile.address || "Chưa có"} />
            <Info
              label="Ngày sinh"
              value={
                profile.dateOfBirth
                  ? formatDate(new Date(profile.dateOfBirth))
                  : "Chưa có"
              }
              icon={<CalendarIcon className="w-4 h-4 text-muted-foreground" />}
            />
            <Info label="Giới tính" value={profile.gender} />
            <Info
              label="Tiền sử bệnh"
              value={profile.medicalHistory || "Không có"}
            />
            <Info
              label="Chia sẻ dữ liệu"
              value={profile.privacySettings.shareData ? "Có" : "Không"}
            />
            <Info
              label="Hiển thị email công khai"
              value={profile.privacySettings.showEmail ? "Có" : "Không"}
            />
          </div>

          {/* Ảnh đại diện */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={avatarUrl}
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
