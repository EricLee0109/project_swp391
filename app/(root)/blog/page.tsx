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
          { label: "Blogs", href: "/blog" },
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

        <MaxWidthWrapper>
          <Blogs blogs={blogs} />
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
