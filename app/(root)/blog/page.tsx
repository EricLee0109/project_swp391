import Blogs from "@/components/blog/Blogs";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";


export default function BlogsPage() {
  return (
    <div>
       <MaxWidthWrapper>
        <h1 className="text-3xl font-extrabold uppercase text-center py-5">
          Bài đăng
        </h1>
        <Blogs />
      </MaxWidthWrapper>
    </div>
  )
}
