import Blogs from "@/components/blog/Blogs";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import Breadcrumb from "@/components/share/Breadcrumb";
import { GETBlog } from "@/types/blog/blog";

async function getBlogs() {
  const res = await fetch(`${process.env.BE_BASE_URL}/blogs/public`, {
    method: "GET",
    cache: "no-store",
  });
  return res.json();
}

export default async function BlogsPage() {
  const blogsData = await getBlogs();
  const blogs: GETBlog[] = blogsData.blogs;

  // const blog = Promise.resolve(blogData);
  // console.log(blogs, "blogdataaa");

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
        <Blogs blogs={blogs} />
      </MaxWidthWrapper>
    </div>
  );
}
