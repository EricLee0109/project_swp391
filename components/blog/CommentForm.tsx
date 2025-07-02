"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CommentFormValues, commentSchema } from "@/types/schemas/FormSchemas";
import { BlogCommentQA } from "@/types/blog/blog";
import { X } from "lucide-react";

async function blogCommentQA(
  req: BlogCommentQA,
  blogId: string,
  comment_id?: string | null,
  replyUser?: string | null
) {
  if (!req) {
    console.error("Blog Comment is undefined");
    return [];
  }

  let body = req;
  // Add commentId to the request body if provided
  if (replyUser) {
    body = comment_id ? { ...req, parent_id: comment_id } : req;
  }

  console.log(body, "body");
  try {
    const response = await fetch(
      `/api/blog-comments/${blogId}`, // Fixed: removed /api
      { method: "POST", body: JSON.stringify(body) }
    );

    if (!response.ok) {
      console.error(`Failed to fetch replies: ${response.status}`);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
}

export default function CommentForm({
  blogId,
  commentId,
  replyUser,
  handleRemove,
}: {
  blogId: string;
  commentId?: string | null;
  replyUser?: string | null;
  handleRemove: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormValues) => {
    await blogCommentQA(
      { content: data.content },
      blogId,
      commentId,
      replyUser
    );
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-2">
      {replyUser && (
        <p className="font-bold text-black flex gap-2 items-center">
          @{replyUser}
          <span
            onClick={handleRemove}
            className="hover:cursor-pointer hover:text-red-500 transition-colors"
          >
            <X size={15} />
          </span>
        </p>
      )}
      <Textarea
        {...register("content")}
        placeholder="Nhập bình luận của bạn..."
        className="w-full"
        disabled={isSubmitting}
      />
      {errors.content && (
        <p className="text-xs text-red-500">{errors.content.message}</p>
      )}
      <Button
        className="hover:text-pink-500 hover:bg-white transition-all hover:animate-pulse"
        type="submit"
        disabled={isSubmitting}
      >
        Gửi bình luận
      </Button>
    </form>
  );
}
