import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { GETBlog, GETBlogComment } from "@/types/blog/blog";
import BlogDetailClient from "@/app/(root)/blog/[id]/BlogDetailClient";
import BlogCommentClient from "@/app/(root)/blog-comments/[id]/BlogCommentClient";
import { auth } from "@/auth";
import RelatedBlogsSection from "@/components/blog/RelatedBlogCard";

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

async function getRelatedBlog(category: string) {
  const res = await fetch(
    `${process.env.BE_BASE_URL}/blogs/related?category=${category}`,
    {
      method: "GET",
    }
  );
  return res.json();
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Next js required props
  const { id } = await params;
  const session = await auth();
  const accessToken = session?.accessToken;
  // console.log("accessTokennn", session?.accessToken);

  const [blogData, blogCmtData] = await Promise.all([
    getBlogDetail(id),
    getBlogComment(id),
  ]);
  //blogDetail
  const blog: GETBlog = blogData.blog;
  if (!blog) return notFound();
  //blog comment
  const blogComment: GETBlogComment[] = blogCmtData.comments; //have data
  // const relatedBlogs: GETBlog[] = await getBlogDetail();

  const relatedBlogsData = await getRelatedBlog(blog.category);
  const relatedBlogs: GETBlog[] = relatedBlogsData.blogs;
  console.log(relatedBlogs, "relatedBlogs");
  return (
    <>
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-12 gap-5">
          {/* Blog Detail */}
          <section className="col-span-12 lg:col-span-12">
            <BlogDetailClient key={blog.post_id} blog={blog} />
          </section>

          {/* Blog Comment Section */}
          <section className="col-span-4 lg:col-span-8">
            <BlogCommentClient
              accessToken={accessToken ?? null}
              blogId={id}
              blogComment={blogComment}
            />
          </section>

          {/* Related blog */}
          <section className="col-span-12 lg:col-span-4">
            <RelatedBlogsSection relatedBlogs={relatedBlogs} />
          </section>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
