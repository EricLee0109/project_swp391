import Consultant from "@/components/consultant-page/Consultant";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { ConsultantProfile } from "@/types/user/User";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";

// async function fetchAllConsultant() {
//   const response = await fetch(
//     `${process.env.BE_BASE_URL}/auth/profile/consultants/all`,
//     { method: "GET", next: { revalidate: 3000 } }
//   );
//   const data: ConsultantProfile[] = await response.json();
//   return data;
// }

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
