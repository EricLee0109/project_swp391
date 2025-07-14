import Breadcrumb from "@/components/share/Breadcrumb";

interface ConsultantPageLayoutProps {
  children: React.ReactNode;
}

const ConsultantPageLayout = ({ children }: ConsultantPageLayoutProps) => {
  return (
    <div className="min-h-screen font-sans mdl-js">
      {/* mdl-js prevent hyderation error from NextJs */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blogs", href: "/blog" },
          { label: "Chi tiết", href: `/blog/` },
        ]}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            Blogs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Các bài viết về sức khỏe giới tính, cùng thảo luận và đặt câu hỏi.
          </p>
        </header>

        {/* The stateful, interactive part is delegated to a Client Component */}
        <div>{children}</div>
      </main>
    </div>
  );
};

export default ConsultantPageLayout;
