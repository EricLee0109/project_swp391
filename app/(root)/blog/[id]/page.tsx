import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { GETBlog, GETBlogComment } from "@/types/blog/blog";
import BlogDetailClient from "@/app/(root)/blog/[id]/BlogDetailClient";
import BlogCommentClient from "@/app/(root)/blog-comments/[id]/BlogCommentClient";

//Nextjs required PageProps
interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getBlogDetail(blogId: string) {
  const res = await fetch(`${process.env.BE_BASE_URL}/blogs/public/${blogId}`, {
    method: "GET",
  });
  return res.json();
}

async function getBlogComment(blogId: string) {
  const res = await fetch(
    `${process.env.BE_BASE_URL}/blog-comments/${blogId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );
  return res.json();
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Next js required props
  const { id } = await params;

  const [blogData, blogCmtData] = await Promise.all([
    getBlogDetail(id),
    getBlogComment(id),
  ]);
  //blogDetail
  const blog: GETBlog = blogData.blog;
  if (!blog) return notFound();
  //blog comment
  const blogComment: GETBlogComment[] = blogCmtData.comments;
  // const relatedBlogs: GETBlog[] = await getBlogDetail();

  return (
    <MaxWidthWrapper className="py-10">
      <div className="grid grid-cols-12 gap-5">
        {/* Blog Detail */}
        <section className="col-span-12 lg:col-span-8">
          <BlogDetailClient key={blog.post_id} blog={blog} />
        </section>

        {/* Related blog */}
        <section className="col-span-12 lg:col-span-4">
          <div className="py-10">
            <h3 className="text-xl font-bold border-b border-pink-500 py-3">
              Các bài đăng liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
              {/* {relatedBlogs.map((item, index) => (
                <BlogCard key={index} blog={item} />
              ))} */}
              <p>Không có</p>
            </div>
          </div>
        </section>

        {/* Blog Comment Section */}
        <section className="col-span-12 lg:col-span-10">
          <BlogCommentClient blogId={id} blogComment={blogComment} />
        </section>
      </div>
    </MaxWidthWrapper>
  );
}
