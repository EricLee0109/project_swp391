import Consultant from "@/components/consultant-page/Consultant";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { ConsultantProfile } from "@/types/user/CustomServiceType";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";

export default async function ConsultantsPage() {
  const consultants: ConsultantProfile[] | null =
    await getAllConsultantProfiles();

  console.log(consultants, "consultants");
  return (
    <div>
      <MaxWidthWrapper>
        <Consultant consultantProfiles={consultants || []} />
      </MaxWidthWrapper>
    </div>
  );
}
