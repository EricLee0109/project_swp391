// components/consultant-page/ConsultantDetail.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConsultantProfile } from "@/types/user/User";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  consultant: ConsultantProfile;
}

export default function ConsultantDetail({ consultant }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-6 rounded-xl">
      {/* LEFT: Consultant Image */}
      <div className="relative w-full h-96">
        <Image
          src="/white-placeholder.png"
          alt={consultant.user.full_name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* RIGHT: Info section */}
      <Card className="p-6 flex flex-col justify-center gap-4">
        <h2 className="text-2xl font-semibold">{consultant.user.full_name}</h2>

        <div className="flex gap-2">
          <span className="font-medium">Chuyên môn:</span>
          <Badge>{consultant.specialization}</Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Trình độ: {consultant.qualifications}</p>
          <p>Kinh nghiệm: {consultant.experience}</p>
          <p>Đánh giá: <span className="text-yellow-500 font-semibold">{consultant.average_rating} ⭐</span></p>
          <p>Trạng thái: {consultant.is_verified ? "✅ Đã xác minh" : "⚠️ Chưa xác minh"}</p>
        </div>

        <div className="mt-4">
          <Button variant="default">Đặt lịch hẹn</Button>
        </div>
      </Card>
    </div>
  );
}
