import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ returnId: string }> }
) {
  try {
    const params = await context.params;
    const { returnId } = params;

    if (!returnId) {
      return NextResponse.json({ error: "Thiếu returnId." }, { status: 400 });
    }

    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Chưa đăng nhập." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Thiếu trường status trong request body." },
        { status: 400 }
      );
    }

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/shipping/return/${returnId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          { error: "Token không hợp lệ hoặc hết hạn." },
          { status: 401 }
        );
      }
      const errorBody = await beRes.text();
      throw new Error(
        `Backend trả về lỗi với mã trạng thái ${beRes.status}: ${errorBody}`
      );
    }

    const data = await beRes.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn chiều về:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái đơn chiều về. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
