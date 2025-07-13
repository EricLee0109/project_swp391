// app/(root)/consultant/page.tsx

import ConsultantCard from "@/components/consultant-page/ConsultantCart";
import EmptyComments from "@/components/EmptyCommentSection";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import { notFound } from "next/navigation";

interface ConsultantProps {
  // consultantProfiles: ConsultantProfile[];
  consultantProfiles: ConsultantGetAll[];
}

export default function Consultant({ consultantProfiles }: ConsultantProps) {
  if (!consultantProfiles) return notFound();
  return (
    <div className="p-6 space-y-6">
      {consultantProfiles && consultantProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {consultantProfiles.map((consultant) =>
            consultant.consultant?.consultant_id ? (
              <ConsultantCard
                key={consultant.consultant.consultant_id}
                consultant={consultant}
              />
            ) : null
          )}
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
