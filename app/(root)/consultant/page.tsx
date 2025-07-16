// app/consultant/page.tsx
export const dynamic = "force-dynamic";
import Consultant from "@/components/consultant-page/Consultant";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import Breadcrumb from "@/components/share/Breadcrumb";
import ConsultantPageHeader from "./ConsultantPageHeader";

export default async function ConsultantsPage() {
  const consultants: ConsultantGetAll[] | null =
    await getAllConsultantProfiles();

  return (
    <div className="min-h-screen font-sans">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tư vấn viên", href: "/consultant" },
        ]}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <ConsultantPageHeader />
        <MaxWidthWrapper>
          <Consultant consultantProfiles={consultants || []} />
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
