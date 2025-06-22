import { Blog } from "@/types/blog/blog";

export const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "Những điều cần biết về bệnh lây truyền qua đường tình dục (STIs)",
    content: `<div><h2>Giới thiệu về STIs</h2><p>STIs là các bệnh truyền từ người này sang người khác...</p></div>`,
    createdAt: "2024-10-16",
    createdBy: "Nguyễn Văn A",
    thumbnail: "https://images.pexels.com/photos/6957507/pexels-photo-6957507.jpeg?auto=compress&cs=tinysrgb&h=300&w=600",
  },
  {
    id: 2,
    title: "Tương lai AI trong xử lý âm thanh",
    content: "<p>AI đang thay đổi cách âm nhạc được tạo và xử lý...</p>",
    createdAt: "2024-10-17",
    createdBy: "Nguyễn Văn B",
    thumbnail: "/blogImage2.png",
  },
  {
    id: 3,
    title: "Đánh giá nhanh VP4",
    content: "<p>Bài viết đánh giá thực tế VP4 từ Fractal...</p>",
    createdAt: "2024-10-20",
    createdBy: "Nguyễn Văn C",
    thumbnail: "/blogImage3.png",
  },
];
