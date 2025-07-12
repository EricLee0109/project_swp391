"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConsultantProfile } from "@/types/user/User";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Sửa từ 'next/router'
import Image from "next/image";

interface Props {
  consultant: ConsultantProfile;
}

export default function ConsultantCard({ consultant }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/consultant/${consultant.consultant_id}`); // ✅ Sửa route
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="relative w-full h-60">
        <Image
          src={"/white-placeholder.png"}
          alt={`Ảnh của ${consultant.user.full_name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover rounded-t-xl"
        />
      </div>
      <CardContent className="space-y-2 mt-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{consultant.user.full_name}</h3>
          <Badge variant="outline">{consultant.specialization}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Trình độ: {consultant.qualifications}
        </p>
        <p className="text-sm text-muted-foreground">
          Kinh nghiệm: {consultant.experience}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          <Star size={16} fill="currentColor" />
          <span>{consultant.average_rating}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
