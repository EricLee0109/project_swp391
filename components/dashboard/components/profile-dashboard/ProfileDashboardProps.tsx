// ProfileDashboard.tsx (Không dùng "use client")
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { getMyConsultantProfile } from "@/app/api/dashboard/profile-dashboard/action";

export default async function ProfileDashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Không tìm thấy người dùng.</div>;

  const consultantProfile = await getMyConsultantProfile();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">Thông tin chung</h2>
          <div>Email: {user.email}</div>
          <div>Họ và tên: {user.name}</div>
          <div>Vai trò: <Badge>{user.role}</Badge></div>
          <div>Thời gian tạo: {new Date().toLocaleString()}</div>
        </CardContent>
      </Card>

      {consultantProfile && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Hồ sơ tư vấn viên</h2>
            <div>Trình độ: {consultantProfile.qualifications}</div>
            <div>Kinh nghiệm: {consultantProfile.experience}</div>
            <div>Chuyên môn: {consultantProfile.specialization}</div>
            <div>
              Xác minh: {consultantProfile.is_verified ? "Đã xác minh" : "Chưa xác minh"}
            </div>
            <div>Rating trung bình: {consultantProfile.average_rating ?? "—"} ⭐</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
