"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { GETBlog } from "@/types/blog/blog";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/app/(dashboard)/manager/dashboard/healthServices/loading";

interface BlogCardProps {
  blog: GETBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  if (!blog) {
    return <LoadingSkeleton />;
  }
  const formattedUpdateDate = formatDate(blog.updated_at);

  return (
    <>
      <li className="startup-card group">
        <div className="flex-between">
          <p className="start-card_date">
            Ngày cập nhật: {formattedUpdateDate}
          </p>
          <div className="flex gap-1.5">
            <EyeIcon className="size-6 text-primary" />
            <span className="text-16-medium">{blog.views_count}</span>
          </div>
        </div>

        <div className="flex-between mt-5 gap-5">
          <div className="flex-1">
            <Link href={`/user/${blog.author.full_name}`}>
              <p>{blog.author.full_name}</p>
            </Link>
            <Link href={`/startup/${blog.post_id}`}>
              <h3 className="text-26-semibold line-clamp-1">{blog.title}</h3>
            </Link>
          </div>
          <Link href={`/user/${blog.author.full_name}`}>
            <Image
              src="https://placehold.co/48x48"
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
        </div>

        <Link href={`/blog/${blog.post_id}`}>
          <p className="startup-card_desc">{blog.content}</p>
          <Image
            src={
              "https://dummyjson.com/image/400x200/282828?fontFamily=pacifico&text=Blog+Image"
            }
            alt="startup image"
            width={500}
            height={300}
            className="startup-card_img"
          />
        </Link>

        <div className="flex-between gap-3 mt-5">
          <Link href={`/?query=${blog.category.toLowerCase()}`}>
            <p className="text-16-medium">{blog.category}</p>
          </Link>
          <Button className="startup-card_btn" asChild>
            <Link href={`/blog/${blog.post_id}`}>Chi tiết</Link>
          </Button>
        </div>
      </li>
    </>
  );
};

export default BlogCard;
