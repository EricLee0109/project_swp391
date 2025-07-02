import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const params = await context.params;
    const { blogId } = params;

    if (!blogId) {
      return NextResponse.json(
        { error: "Thiếu blog blogId trong URL." },
        { status: 400 }
      );
    }
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${blogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    return NextResponse.json(
      { message: "Xoá lịch hẹn thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xoá lịch hẹn:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể xoá lịch hẹn." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  const params = await context.params;
  const blogId = params.blogId;

  const session = await auth();
  const headers: Record<string, string> = {};
  if (session && session.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  try {
    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/blogs/public/${blogId}`,
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
