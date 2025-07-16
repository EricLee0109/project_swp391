import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const params = await context.params;
    const { appointmentId } = params;

    if (!appointmentId) {
      return NextResponse.json({ error: "Thiếu appointmentId." }, { status: 400 });
    }

    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Chưa đăng nhập." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Đánh giá phải từ 1 đến 5 sao." },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: "Nhận xét không được để trống." },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${appointmentId}/feedback`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ rating, comment }),
      }
    );

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          { error: "Token không hợp lệ hoặc hết hạn." },
          { status: 401 }
        );
      }
      const errorData = await beRes.json();
      throw new Error(
        errorData.message || `Backend trả về lỗi với mã trạng thái ${beRes.status}`
      );
    }

    const data = await beRes.json();

    return NextResponse.json(
      { message: "Gửi đánh giá thành công", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi gửi đánh giá:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể gửi đánh giá. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
