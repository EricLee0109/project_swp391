// File: app/(root)/consultant/[id]/page.tsx

import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";
import { ConsultantProfile } from "@/types/user/User";
import Breadcrumb from "@/components/share/Breadcrumb";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id: consultantId } = await params;
  console.log(consultantId, "consultant");
  // ✅ Gọi toàn bộ consultants
  const consultants = await getAllConsultantProfiles();

  // ✅ Tìm người có id phù hợp
  const consultant: ConsultantProfile | undefined = consultants?.find(
    (c) => c.consultant_id === consultantId
  );

  if (!consultant) return notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tư vấn viên", href: "/consultant" },
          { label: "Chi tiết", href: `/consultant/${consultantId}` },
        ]}
      />
      <main className="h-screen py-6">
        <MaxWidthWrapper>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background rounded-xl">
            <div className="relative w-full h-[400px]">
              <Image
                src={"/white-placeholder.png"}
                alt={`Ảnh của ${consultant.user.full_name}`}
                fill
                className="object-cover rounded-l-xl"
              />
            </div>

            <Card className="rounded-none md:rounded-r-xl p-6 flex flex-col justify-between shadow-none border-l md:border-l">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">
                  {consultant.user.full_name}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="font-medium">Chuyên môn:</span>
                  <Badge>{consultant.specialization}</Badge>
                </div>

                <div className="text-sm text-muted-foreground space-y-1 border-t border-gray-700 mt-4 pt-4">
                  <p>Trình độ: {consultant.qualifications}</p>
                  <p>Kinh nghiệm: {consultant.experience}</p>
                  <p>
                    Đánh giá:{" "}
                    <span className="text-yellow-500 font-semibold">
                      {consultant.average_rating} ⭐
                    </span>
                  </p>
                  <p>
                    Trạng thái:{" "}
                    {consultant.is_verified
                      ? "✅ Đã xác minh"
                      : "⚠️ Chưa xác minh"}
                  </p>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4 text-sm text-muted-foreground">
                  Mô tả về tư vấn viên này. Bạn có thể đặt lịch tư vấn bằng nút
                  bên dưới.
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full" variant="default">
                  Đặt lịch tư vấn
                </Button>
              </div>
            </Card>
          </section>
        </MaxWidthWrapper>
      </main>
    </>
  );
}
