// // ProfileDashboard.tsx (Không dùng "use client")
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { auth } from "@/auth";
// import { notFound } from "next/navigation";
// import { ConsultantProfile } from "@/types/user/User";

// interface ProfileDashboardProps {
//   profile: ConsultantProfile | null;
// }

// export default async function ProfileDashboard({
//   profile,
// }: ProfileDashboardProps) {
//   const session = await auth();
//   const user = session?.user;

//   if (!user || !profile) return notFound();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <Card>
//         <CardContent className="p-4 space-y-2">
//           <h2 className="text-lg font-semibold">Thông tin chung</h2>
//           <div>Email: {user.email}</div>
//           <div>Họ và tên: {user.name}</div>
//           <div>
//             Vai trò: <Badge>{user.role}</Badge>
//           </div>
//           <div>Thời gian tạo: {new Date().toLocaleString()}</div>
//         </CardContent>
//       </Card>

//       {profile && (
//         <Card>
//           <CardContent className="p-4 space-y-2">
//             <h2 className="text-lg font-semibold">Hồ sơ tư vấn viên</h2>
//             <div>Trình độ: {profile.qualifications}</div>
//             <div>Kinh nghiệm: {profile.experience}</div>
//             <div>Chuyên môn: {profile.specialization}</div>
//             <div>
//               Xác minh: {profile.is_verified ? "Đã xác minh" : "Chưa xác minh"}
//             </div>
//             <div>Rating trung bình: {profile.average_rating ?? "—"} ⭐</div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
