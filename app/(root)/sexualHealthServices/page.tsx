import { ServiceBrowser } from "@/components/healthServices/ServicesBrowser";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import Breadcrumb from "@/components/share/Breadcrumb";

export default function SexualHealthServicesPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Dịch vụ sức khỏe", href: "/sexualHealthServices" },
        ]}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <MaxWidthWrapper>
          <div className="min-h-screen font-sans">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
                Các dịch vụ sức khỏe giới tính
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Riêng tư, cao cấp, thoải mái, mọi thông tin của khách hàng khi
                khám đều được mã hóa.
              </p>
            </header>

            {/* The stateful, interactive part is delegated to a Client Component */}
            <ServiceBrowser />
          </div>
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
