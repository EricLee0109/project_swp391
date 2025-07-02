// app/(root)/consultant/page.tsx

import { getAllConsultantProfiles } from "@/app/api/consultant/action";
import ConsultantCard from "@/components/consultant-page/ConsultantCart";

export default async function ConsultantPage() {
  const consultants = await getAllConsultantProfiles();

  if (!consultants) return <div>Lỗi khi tải danh sách tư vấn viên</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.consultant_id}
            consultant={consultant}
          />
        ))}
      </div>
    </div>
  );
}
