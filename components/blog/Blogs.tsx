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

const blogData = [
  {
    id: 1,
    title:
      "Fractal Audio Systems Launches VP4 A Direct Competitor to HX Effect, Eventide H90",
    content:
      "Fractal Audio Systems has just officially introduced VP4, a compact but powerful virtual pedalboard...",
    createdAt: "2024-10-16",
    thumbnail: "/blogImage1.png",
  },
  {
    id: 2,
    title: "Exploring the Future of Audio Effects with AI",
    content:
      "The integration of artificial intelligence in music effects is shaping the future...",
    createdAt: "2024-10-17",
    thumbnail: "/blogImage2.png",
  },
  {
    id: 3,
    title: "How VP4 Stands Out Against Other Pedalboards",
    content:
      "The VP4 brings more than just compression and delay...",
    createdAt: "2024-10-18",
    thumbnail: "/blogImage3.png",
  },
  {
    id: 4,
    title: "Pedalboards in 2025: What to Expect",
    content:
      "From wireless connections to embedded processing chips...",
    createdAt: "2024-10-19",
    thumbnail: "/blogImage4.png",
  },
  {
    id: 5,
    title: "Crafting the Perfect Tone with Digital Gear",
    content:
      "Digital gear is not the enemy of analog lovers...",
    createdAt: "2024-10-20",
    thumbnail: "/blogImage5.png",
  },
  {
    id: 6,
    title: "5 Pedals That Changed the Sound of Rock",
    content:
      "A throwback to the iconic effects that reshaped music...",
    createdAt: "2024-10-21",
    thumbnail: "/blogImage6.png",
  },
  {
    id: 7,
    title: "VP4 Hands-On Review",
    content:
      "We put the VP4 through a week of rigorous testing...",
    createdAt: "2024-10-22",
    thumbnail: "/blogImage7.png",
  },
  {
    id: 8,
    title: "MIDI Integration in Modern Pedalboards",
    content:
      "How MIDI routing opens new possibilities...",
    createdAt: "2024-10-23",
    thumbnail: "/blogImage8.png",
  },
  {
    id: 9,
    title: "Top Picks for Budget Pedalboards in 2024",
    content:
      "Not everyone needs to break the bank for good tone...",
    createdAt: "2024-10-24",
    thumbnail: "/blogImage9.png",
  },
  {
    id: 10,
    title: "Eventide vs Fractal: The Showdown",
    content:
      "Both brands bring heat to the table — who wins?",
    createdAt: "2024-10-25",
    thumbnail: "/blogImage10.png",
  },
  {
    id: 11,
    title: "What Makes a Pedalboard 'Pro'?",
    content:
      "From materials to routing, here’s what you need to know...",
    createdAt: "2024-10-26",
    thumbnail: "/blogImage11.png",
  },
  {
    id: 12,
    title: "The Compact Revolution: Small Boards, Big Sound",
    content:
      "Why smaller is becoming smarter in modern setups...",
    createdAt: "2024-10-27",
    thumbnail: "/blogImage12.png",
  },
];

const Blogs = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {blogData.map((blog) => (
          <div key={blog.id} className="mb-5">
            <BlogCard
              blogId={blog.id}
              title={blog.title}
              content={blog.content}
              createdAt={blog.createdAt}
              thumbnail={blog.thumbnail}
            />
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
