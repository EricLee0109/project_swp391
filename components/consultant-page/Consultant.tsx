// app/(root)/consultant/page.tsx

import ConsultantCard from "@/components/consultant-page/ConsultantCart";
import EmptyComments from "@/components/EmptyCommentSection";
import { ConsultantProfile } from "@/types/user/User";
import { notFound } from "next/navigation";

interface ConsultantProps {
  consultantProfiles: ConsultantProfile[];
}

export default function Consultant({ consultantProfiles }: ConsultantProps) {
  if (!consultantProfiles) return notFound();

  return (
    <div className="p-6 space-y-6">
      {consultantProfiles && consultantProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {consultantProfiles.map((consultant: ConsultantProfile) => (
            <ConsultantCard
              key={consultant.consultant_id}
              consultant={consultant}
            />
          ))}
        </div>
      ) : (
        <EmptyComments
          title="Hiện không có tư vấn viên!"
          showActionButton={false}
          description="Hiện không có tư vấn viên nào hoạt động!"
        />
      )}
    </div>
  );
}
