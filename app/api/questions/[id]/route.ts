import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const params = await context.params;
    const { id: questionId } = params;
    const body = await request.json();

    // Validate required fields
    if (!questionId || !body.answer) {
      return NextResponse.json(
        {
          error: "Thiếu các trường bắt buộc (question_id, answer)",
        },
        { status: 400 }
      );
    }

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

    // Forward request to backend API with question_id in URL
    const url = `${process.env.BE_BASE_URL}/questions/${questionId}/answer`;
    const beRes = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        answer: body.answer,
        // Add any other fields you need to send
      }),
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
      { message: "Gửi trả lời thành công", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi gửi trả lời:", error);
    return NextResponse.json(
      { error: "Không thể gửi trả lời. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const params = await context.params;
    const { id: questionId } = params;
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
    };

    // Delete specific question
    const url = `${process.env.BE_BASE_URL}/questions/${questionId}`;
    const beRes = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    return NextResponse.json(
      { message: "Xóa câu hỏi thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi:", error);
    return NextResponse.json(
      { error: "Không thể xóa câu hỏi." },
      { status: 500 }
    );
  }
}
