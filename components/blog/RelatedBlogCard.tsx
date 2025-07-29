"use client";

import { Eye, Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GETBlog } from "@/types/blog/blog";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface RelatedBlogCardProps {
  blog: GETBlog;
}

const RelatedBlogCard = ({ blog }: RelatedBlogCardProps) => {
  const formattedUpdateDate = formatDate(blog.updated_at);

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-primary-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Blog Image */}
          <a href={`/blog/${blog.post_id}`} className="block">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                width={200}
                height={50}
                src="https://dummyjson.com/image/400x200/282828?fontFamily=pacifico&text=Blog+Image"
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>

          {/* Blog Content */}
          <div className="space-y-2">
            <a href={`/blog/${blog.post_id}`}>
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {blog.title}
              </h4>
            </a>

            <p className="text-xs text-gray-600 line-clamp-2">{blog.content}</p>

            {/* Meta Information */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formattedUpdateDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{blog.views_count}</span>
              </div>
            </div>

            {/* Author and Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <span className="text-xs text-gray-600 truncate">
                  {blog.author.full_name}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {blog.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RelatedBlogsSectionProps {
  relatedBlogs: GETBlog[];
}

const RelatedBlogsSection = ({ relatedBlogs }: RelatedBlogsSectionProps) => {
  return (
    <div className="bg-white border-l-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary p-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Các bài đăng liên quan</span>
          <ArrowRight className="w-4 h-4" />
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {relatedBlogs && relatedBlogs.length > 0 ? (
          <div className="space-y-4">
            {relatedBlogs.slice(0, 5).map((blog, index) => (
              <div key={blog.post_id}>
                <RelatedBlogCard blog={blog} />
                {index < Math.min(relatedBlogs.length, 5) - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}

            {relatedBlogs.length > 5 && (
              <div className="pt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary-500 border-primary-500 hover:bg-green-50"
                >
                  Xem thêm ({relatedBlogs.length - 5} bài viết)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Không có bài viết liên quan</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Alternative compact list version
const RelatedBlogsCompact = ({ relatedBlogs }: RelatedBlogsSectionProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-primary-500 pb-2 inline-block">
          Các bài đăng liên quan
        </h3>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {relatedBlogs && relatedBlogs.length > 0 ? (
          relatedBlogs.slice(0, 6).map((blog) => (
            <div
              key={blog.post_id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Link href={`/blog/${blog.post_id}`}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src="https://dummyjson.com/image/400x200/282828?fontFamily=pacifico&text=Blog"
                        alt={blog.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/blog/${blog.post_id}`}>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-500 transition-colors mb-1">
                      {blog.title}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.updated_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {blog.views_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">
                      {blog.author.full_name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {blog.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Không có bài viết liên quan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedBlogsSection;
export { RelatedBlogsCompact };
