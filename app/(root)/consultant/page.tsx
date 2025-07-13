import Consultant from "@/components/consultant-page/Consultant";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";

export default async function ConsultantsPage() {
  const consultants: ConsultantGetAll[] | null =
    await getAllConsultantProfiles();

  return (
    <div>
      <MaxWidthWrapper>
        <Consultant consultantProfiles={consultants || []} />
      </MaxWidthWrapper>
    </div>
  );
}
