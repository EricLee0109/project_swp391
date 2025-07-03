export const dynamic = "force-dynamic";

import Consultant from "@/components/consultant-page/Consultant";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";

export default function ConsultantsPage() {
  return (
    <div>
      <MaxWidthWrapper>
        <Consultant />
      </MaxWidthWrapper>
    </div>
  );
}
