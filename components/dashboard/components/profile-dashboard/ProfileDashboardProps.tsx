"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantProfile, User } from "@/types/user/User";

interface FullProfile {
  user: User;
  consultantProfile?: ConsultantProfile | null;
  customerProfile?: {
    date_of_birth: string;
    gender: string;
    medical_history: string;
  } | null;
  date_of_birth?: string;
  gender?: string;
  medical_history?: string;
  [key: string]: unknown;
}

export default function ProfileDashboard() {
  const [data, setData] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) throw new Error("Lỗi khi fetch profile");
        const result: FullProfile = await res.json();
        setData(result);
      } catch (err) {
        console.error("Lỗi:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">Không thể tải thông tin người dùng.</p>
      </Card>
    );
  }

  const { user, consultantProfile, customerProfile } = data;
  const health = customerProfile || {
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    medical_history: data.medical_history,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Thông tin người dùng */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Thông tin chung</h2>
          <div className="flex items-center gap-4">
            <Image
              src={user.image || "https://via.placeholder.com/96"}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover border"
            />
            <div className="space-y-1 text-sm">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Họ và tên:</strong> {user.full_name}</div>
              <div><strong>SĐT:</strong> {user.phone_number}</div>
              <div><strong>Địa chỉ:</strong> {user.address}</div>
              <div><strong>Vai trò:</strong> <Badge>{user.role}</Badge></div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Badge variant="outline" className={user.is_active ? "text-green-700 border-green-500" : "text-red-700 border-red-500"}>
                  {user.is_active ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
              <div>
                <strong>Xác minh:</strong>{" "}
                <Badge variant="outline" className={user.is_verified ? "text-green-700 border-green-500" : "text-yellow-700 border-yellow-500"}>
                  {user.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin hồ sơ sức khỏe */}
      {health?.date_of_birth && (
        <Card>
          <CardContent className="p-4 space-y-2 text-sm">
            <h2 className="text-lg font-semibold">Thông tin hồ sơ sức khỏe</h2>
            <div><strong>Ngày sinh:</strong> {new Date(health.date_of_birth).toLocaleDateString("vi-VN")}</div>
            <div>
              <strong>Giới tính:</strong>{" "}
              {health.gender === "Female" ? "Nữ" : health.gender === "Male" ? "Nam" : "Khác"}
            </div>
            <div><strong>Tiền sử bệnh:</strong> {health.medical_history || "Không có"}</div>
          </CardContent>
        </Card>
      )}

      {/* Thông tin tư vấn viên */}
      {consultantProfile && (
        <Card>
          <CardContent className="p-4 space-y-2 text-sm">
            <h2 className="text-lg font-semibold">Thông tin chuyên môn tư vấn viên</h2>
            <div><strong>Bằng cấp:</strong> {consultantProfile.qualifications}</div>
            <div><strong>Kinh nghiệm:</strong> {consultantProfile.experience}</div>
            <div><strong>Chuyên môn:</strong> {consultantProfile.specialization}</div>
            <div><strong>Đánh giá trung bình:</strong> {consultantProfile.average_rating}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
