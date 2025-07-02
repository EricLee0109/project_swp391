"use client";

import BlogCard from "@/components/blog/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { GETBlog } from "@/types/blog/blog";

interface BlogProps {
  blogs: GETBlog[];
}

const Blogs = ({ blogs }: BlogProps) => {
  console.log(blogs, "blogs");
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <div key={blog.post_id} className="mb-5">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      <Pagination className="my-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Blogs;
