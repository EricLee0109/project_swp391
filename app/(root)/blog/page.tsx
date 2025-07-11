import Blogs from "@/components/blog/Blogs";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
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
      <MaxWidthWrapper>
        <Blogs blogs={blogs} />
      </MaxWidthWrapper>
    </div>
  );
}
