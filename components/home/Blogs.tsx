import { Button } from "@/components/ui/button";
import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";
import { GETBlog } from "@/types/blog/blog";

interface BlogHomeProps {
  blogs: GETBlog[];
}

const BlogHome = ({ blogs }: BlogHomeProps) => {
  return (
    <div className="my-16 px-4 md:px-8">
      <h2 className="text-center font-extrabold text-3xl my-5 uppercase">
        Bài viết nổi bật
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {blogs.map((blog, index) => (
          <div key={index} className="mb-5">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
      <div className="text-center my-10">
        <Link href="/blog">
          <Button className="uppercase rounded-xl px-5">
            Xem thêm bài viết
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogHome;
