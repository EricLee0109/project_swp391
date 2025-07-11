"use client";
import LoadingSkeleton from "@/app/(dashboard)/admin/dashboard/healthServices/loading";
import CommentForm from "@/components/blog/CommentForm";
import EmptyComments from "@/components/EmptyCommentSection";
import { formatDate } from "@/lib/utils";
import { BlogComment, GETBlogComment } from "@/types/blog/blog";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface BlogCommentClientProps {
  accessToken: string | null;
  blogComment: GETBlogComment[];
  blogId: string;
}

// async function getRepliesComment(comment_id: string) {
//   if (!comment_id) {
//     console.error("comment_id is undefined");
//     return [];
//   }

//   try {
//     const response = await fetch(
//       `${process.env.BE_BASE_URL}/blog-comments/${comment_id}/replies`, // Fixed: removed /api
//       { method: "GET" }
//     );

//     if (!response.ok) {
//       console.error(`Failed to fetch replies: ${response.status}`);
//       return [];
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Error fetching replies:", error);
//     return [];
//   }
// }

export default function BlogCommentClient({
  accessToken,
  blogComment,
  blogId,
}: BlogCommentClientProps) {
  console.log(blogComment, "blogComment");
  //   const response = await getRepliesComment(blogComment.comment_id);
  //   const replies = await response;
  const [displayCommentSection, setDisplayCommentSection] =
    useState<boolean>(false);
  const [replyUser, setReplyUser] = useState<string | null>(null);
  const [cmtId, setCmtId] = useState<string | null>(null);
  const pathName = usePathname();
  const router = useRouter();

  const handleReply = (comment: GETBlogComment) => {
    setReplyUser(comment.user.full_name);
    setCmtId(comment.comment_id);
  };

  const handleRemove = () => {
    setReplyUser(null);
    setCmtId(null);
  };

  const handleAddComment = () => {
    setDisplayCommentSection(!displayCommentSection);
  };

  return (
    <>
      <h3 className="text-xl font-bold border-b border-pink-500 py-3">
        Bình luận (Hỏi đáp Q&A)
      </h3>
      {blogComment && blogComment.length > 0 ? (
        <div className="flex flex-col gap-4 py-3">
          {blogComment &&
          Array.isArray(blogComment) &&
          blogComment.length > 0 ? (
            blogComment.map((comment) => (
              <div
                key={comment.comment_id}
                className="border rounded-md p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    onClick={() => handleReply(comment)}
                    className="cursor-pointer"
                  >
                    <span className="font-semibold text-sm text-gray-700">
                      {comment.user.full_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.created_at)}
                    </span>
                    <p className="text-gray-800 mb-2">{comment.content}</p>
                  </div>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <CommentWithReplies comment={comment} />
                )}
              </div>
            ))
          ) : (
            <LoadingSkeleton />
          )}
          <div>
            <CommentForm
              accessToken={accessToken}
              replyUser={replyUser || null}
              commentId={cmtId}
              blogId={blogId}
              handleRemove={handleRemove}
              onRequireLogin={() =>
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(pathName)}`
                )
              }
            />
          </div>
        </div>
      ) : (
        <>
          {displayCommentSection ? (
            <EmptyComments
              title="No comments yet"
              description="Start the conversation! Share your thoughts and engage with other readers."
              onActionClick={handleAddComment}
              className="border-2 border-dashed border-gray-200 rounded-lg"
            />
          ) : (
            <CommentForm
              accessToken={accessToken}
              replyUser={replyUser || null}
              commentId={cmtId}
              blogId={blogId}
              handleRemove={handleRemove}
              onRequireLogin={() =>
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(pathName)}`
                )
              }
            />
          )}
        </>
      )}
    </>
  );
}

function CommentWithReplies({ comment }: { comment: GETBlogComment }) {
  //   const replies = await getRepliesComment(comment.comment_id);

  return (
    <div>
      <div className="ml-4 border-l-2 border-pink-400 pl-3 mt-2">
        {comment.replies.map((reply: BlogComment) => (
          <div key={reply.comment_id} className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-gray-600">
                {reply.user.full_name}
              </span>
              <span className="text-xs text-gray-300">
                {formatDate(reply.created_at)}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{reply.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
