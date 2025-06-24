import { Button } from "@/components/ui/button";
import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";

const data = [
  {
    id: 1,
    title: "6 dấu hiệu bạn có thể đã nhiễm Chlamydia mà không biết",
    content:
      "Chlamydia là một trong những bệnh lây qua đường tình dục phổ biến nhất hiện nay. Rất nhiều người nhiễm mà không hề có triệu chứng...",
    createdAt: "2024-10-16",
    thumbnail: "/blogImage1.png",
  },
  {
    id: 2,
    title: "Tại sao bạn nên xét nghiệm STIs định kỳ?",
    content:
      "Xét nghiệm định kỳ giúp phát hiện sớm các bệnh lây qua đường tình dục, ngay cả khi không có triệu chứng rõ ràng. Đây là cách bảo vệ chính mình và người khác.",
    createdAt: "2024-10-10",
    thumbnail: "/blogImage2.png",
  },
  {
    id: 3,
    title: "HPV: Những điều bạn cần biết về vắc xin và phòng ngừa",
    content:
      "HPV có thể gây ra nhiều bệnh lý nghiêm trọng như ung thư cổ tử cung, ung thư hậu môn. Bài viết này sẽ giúp bạn hiểu rõ hơn về cách phòng tránh.",
    createdAt: "2024-09-28",
    thumbnail: "/blogImage3.png",
  },
  {
    id: 4,
    title: "Tình dục an toàn: Những nguyên tắc bạn không nên bỏ qua",
    content:
      "Bao cao su không phải là lựa chọn duy nhất. Cùng khám phá các biện pháp an toàn và cách giao tiếp với bạn tình về STIs.",
    createdAt: "2024-09-20",
    thumbnail: "/blogImage4.png",
  },
];

const BlogHome = () => {
  return (
    <div className="my-16 px-4 md:px-8">
      <h2 className="text-center font-extrabold text-3xl my-5 uppercase">
        Bài viết nổi bật
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((blog, index) => (
          <BlogCard
            key={`blog-${index}`}
            blogId={blog.id}
            title={blog.title}
            content={blog.content}
            createdAt={blog.createdAt}
            thumbnail={blog.thumbnail}
          />
        ))}
      </div>
      <div className="text-center my-10">
        <Link href="/blog">
          <Button className="uppercase rounded-xl px-5">
            Xem thêm bài viết
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogHome;
