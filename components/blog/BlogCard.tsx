"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { StaticImageData } from "next/image";
import Image from "next/image";

interface BlogCardProps {
  blogId: number;
  thumbnail: string | StaticImageData;
  createdAt: string;
  title: string;
  content: string;
  variant?: "small" | "default";
}

const BlogCard = ({
  blogId,
  thumbnail,
  createdAt,
  title,
  content,
  variant = "default",
}: BlogCardProps) => {
  const formattedDate = formatDate(new Date(createdAt));

  if (variant === "default") {
    return (
      <div>
        <AspectRatio ratio={16 / 10}>
          <Image
            src={
              typeof thumbnail === "string"
                ? thumbnail
                : (thumbnail as StaticImageData)
            }
            alt={title}
            fill
            className="object-cover object-center rounded-md"
          />
        </AspectRatio>

        <p className="my-2 text-sm">{formattedDate}</p>

        <Link href={`/blog/${blogId}`}>
          <h3 className="font-bold my-2">{title}</h3>
        </Link>

        <p className="text-sm text-gray-500">{content}</p>

        <Link
          href={`/blog/${blogId}`}
          className="my-3 text-sm font-semibold underline"
        >
          Xem thêm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-1">
        <AspectRatio ratio={16 / 10}>
          <Image
            src={
              typeof thumbnail === "string"
                ? thumbnail
                : (thumbnail as StaticImageData)
            }
            alt={title}
            fill
            className="object-cover object-center rounded-md"
          />
        </AspectRatio>
      </div>

      <div className="col-span-2">
        <Link href={`/blog/${blogId}`}>
          <h3 className="font-bold text-sm">{title}</h3>
        </Link>
        <p className="text-sm">{formattedDate}</p>
        <Link
          href={`/blog/${blogId}`}
          className="text-sm font-semibold underline"
        >
          Xem thêm
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
