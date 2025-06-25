import { notFound } from "next/navigation";
import { mockBlogs } from "@/data/mock-blog";
import TiptapView from "@/components/tiptap/TiptapView";
import BlogCard from "@/components/blog/BlogCard";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

//Nextjs required PageProps
interface PageProps {
  params: Promise<{ blogId: string }>;
}

export default async function Page(props: PageProps) {
  // Next js required props
  const params = await props.params;
  const paramsBlogId = params.blogId;
  const blogId = parseInt(paramsBlogId);
  const blog = mockBlogs.find((b) => b.id === blogId);

  if (!blog) return notFound();

  const relatedBlogs = mockBlogs.filter((b) => b.id !== blogId);

  return (
    <MaxWidthWrapper className="py-10">
      <div className="grid grid-cols-12 gap-5">
        {/* MAIN CONTENT */}
        <div className="col-span-12 lg:col-span-8">
          <div className="pb-5">
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <p className="py-3 text-sm text-gray-500">
              Đăng {formatDate(new Date(blog.createdAt))}, bởi{" "}
              <span className="font-bold">{blog.createdBy}</span>
            </p>
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              width={800}
              height={500}
              className="w-full rounded-md object-cover"
            />
          </div>

          <TiptapView value={blog.content} />

          <div className="py-10">
            <h3 className="text-xl font-bold border-b border-orange-500 py-3">
              Các bài đăng liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
              {relatedBlogs.map((item) => (
                <BlogCard key={item.id} {...item} blogId={item.id} />
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-4">
          <h3 className="text-xl font-bold border-b border-orange-500 py-3">
            Bài viết nổi bật
          </h3>
          <div className="flex flex-col gap-3 py-3">
            {relatedBlogs.map((item) => (
              <BlogCard
                key={item.id}
                {...item}
                blogId={item.id}
                variant="small"
              />
            ))}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
