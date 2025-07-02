import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BlogCommentQA } from "@/types/blog/blog";

export async function POST(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await context.params;

  try {
    const body: BlogCommentQA = await request.json();

    const session = await auth();

    // Check if accessToken is present
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    // Forward request to backend API
    const url = `${process.env.BE_BASE_URL}/blog-comments/${blogId}`;
    const beRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          {
            error:
              "Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          },
          { status: 401 }
        );
      }
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();

    return NextResponse.json(
      { message: "Tạo bình luận hoặc phản hồi thành công", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo lịch hẹn:", error);
    return NextResponse.json(
      { error: "Không thể tạo lịch hẹn. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const headers: Record<string, string> = {};
  if (session && session.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  const { id } = await context.params;

  try {
    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/blog-comments/${id}`,
      {
        method: "GET",
        headers,
      }
    );
    if (!beRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: beRes.status }
      );
    }
    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
