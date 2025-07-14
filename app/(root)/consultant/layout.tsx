import Breadcrumb from "@/components/share/Breadcrumb";
export const dynamic = "force-dynamic";

interface ConsultantPageLayoutProps {
  children: React.ReactNode;
}
interface DetailPageProps {
  params: Promise<{ id: string }>;
}
const ConsultantPageLayout = async ({
  children,
  params,
}: ConsultantPageLayoutProps & DetailPageProps) => {
  const { id: consultantId } = await params;

  return (
    <div className="min-h-screen font-sans">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tư vấn viên", href: "/consultant" },
          { label: "Chi tiết", href: `/consultant/${consultantId}` },
        ]}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            Tư vấn viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Đội ngũ tư vấn viên chuyên nghiệp, hỗ trợ khách hàng mọi lúc.
          </p>
        </header>

        {children}
      </main>
    </div>
  );
};

export default ConsultantPageLayout;
