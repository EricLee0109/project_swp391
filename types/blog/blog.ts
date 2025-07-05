// types/blog.ts

export interface GETBlog {
  post_id: string;
  title: string;
  content: string;
  category: string;
  author: {
    full_name: string;
  };
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  comment_id: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  status: "Approved";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user: { full_name: string };
}

export interface GETBlogComment extends BlogComment {
  replies: BlogComment[];
}

export interface BlogCommentQA {
  content: string;
  parent_id?: string | null;
}

export interface EditBlog {
  post_id: string;
  title: string;
  content: string;
  category: string;
}

export interface CreateBlog {
  title: string;
  content: string;
  category: string;
}
