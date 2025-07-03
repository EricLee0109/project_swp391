// app/(root)/consultant/page.tsx

import ConsultantCard from "@/components/consultant-page/ConsultantCart";
import { ConsultantProfile } from "@/types/user/User";
import { notFound } from "next/navigation";

interface ConsultantProps {
  consultantProfiles: ConsultantProfile[];
}

export default function Consultant({ consultantProfiles }: ConsultantProps) {
  if (!consultantProfiles) return notFound();

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {consultantProfiles.map((consultant: ConsultantProfile) => (
          <ConsultantCard
            key={consultant.consultant_id}
            consultant={consultant}
          />
        ))}
      </div>
    </div>
  );
}
