"use client";

import TiptapView from "@/components/tiptap/TiptapView";
import { formatDate } from "@/lib/utils";
import { GETBlog } from "@/types/blog/blog";
import Image from "next/image";

interface BlogDetailClientProps {
  blog: GETBlog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const formattedCreateDate = formatDate(blog.created_at);

  return (
    <>
      {/* MAIN CONTENT */}
      {/* <div className="col-span-12 lg:col-span-8"> */}
      <div className="pb-5">
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <p className="py-3 text-sm text-gray-500">
          Đăng {formattedCreateDate}, bởi{" "}
          <span className="font-bold">{blog?.author?.full_name}</span>
        </p>
        <Image
          src={
            "https://dummyjson.com/image/400x200/282828?fontFamily=pacifico&text=Blog+Image"
          }
          alt={blog.title}
          width={800}
          height={500}
          className="w-full rounded-md object-cover"
        />
      </div>

      <TiptapView value={blog.content} />

      {/* </div> */}
    </>
  );
}
