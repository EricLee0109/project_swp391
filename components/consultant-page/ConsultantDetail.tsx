// // components/consultant-page/ConsultantDetail.tsx
// import { Badge } from "@/components/ui/badge";
// import { ConsultantProfile } from "@/types/user/User";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// interface Props {
//   consultant: ConsultantProfile;
// }

// export default function ConsultantDetail({ consultant }: Props) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background rounded-xl">
//       {/* LEFT: image */}
//       <div className="relative w-full h-[400px]">
//         <Image
//           src="/white-placeholder.png"
//           alt="Consultant image"
//           fill
//           className="object-cover rounded-l-xl"
//         />
//       </div>

//       {/* RIGHT: content */}
//       <Card className="rounded-none md:rounded-r-xl p-6 flex flex-col justify-between shadow-none border-l md:border-l">
//         <div className="space-y-3">
//           <h2 className="text-2xl font-semibold">{consultant.user.full_name}</h2>
//           <div className="flex flex-wrap gap-2">
//             <span className="font-medium ">Chuyên môn:</span>
//             <Badge >{consultant.specialization}</Badge>
//           </div>
//           <div className="text-sm text-muted-foreground space-y-1  border-t  border-gray-700 mt-4 pt-4 ">
//             <p>Trình độ: {consultant.qualifications}</p>
//             <p>Kinh nghiệm: {consultant.experience}</p>
//             <p>Đánh giá: <span className="text-yellow-500">{consultant.average_rating} ⭐</span></p>    
//           </div>
//           <div className="border-t  border-gray-700 mt-4 pt-4 text-sm text-muted-foreground">
//             Mô tả về tư vấn viên này. Bạn có thể đặt lịch tư vấn bằng nút bên dưới.
//           </div>
//         </div>

//         <div className="pt-6">
//           <Button className="w-full" variant="default">Đặt lịch tư vấn</Button>
//         </div>
//       </Card>
//     </div>
//   );
// }
