import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { returnId: string } }
) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const returnId = params.returnId;

    // Gọi backend lấy chi tiết đơn chiều về
    const url = `${process.env.BE_BASE_URL}/shipping/return/${returnId}`;

    const beRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
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
      const errorBody = await beRes.text();
      throw new Error(
        `Backend trả về lỗi với mã trạng thái ${beRes.status}: ${errorBody}`
      );
    }

    const responseData = await beRes.json();

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn chiều về:", error);
    return NextResponse.json(
      { error: "Không thể lấy chi tiết đơn chiều về. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
