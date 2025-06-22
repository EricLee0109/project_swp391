// types/blog.ts
export interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string; // hoặc Date nếu bạn dùng chuẩn ISO và convert khi render
  createdBy: string;
  thumbnail: string;
}
