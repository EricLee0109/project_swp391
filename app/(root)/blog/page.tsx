import Blogs from "@/components/blog/Blogs";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import Breadcrumb from "@/components/share/Breadcrumb";


export default function BlogsPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Bài đăng", href: "/blog" },
        ]}
      />
       <MaxWidthWrapper>
        <h1 className="text-3xl font-extrabold uppercase text-center py-5">
          Bài đăng
        </h1>
        <Blogs />
      </MaxWidthWrapper>
    </div>
  )
}
