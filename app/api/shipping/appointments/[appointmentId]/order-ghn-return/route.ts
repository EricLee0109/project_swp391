import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  context: { params: { appointmentId: string } }
) {
  try {
    const params = await context.params; // hoặc bỏ await nếu lỗi
    const appointmentId = params.appointmentId;

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

    const url = `${process.env.BE_BASE_URL}/shipping/appointments/${appointmentId}/order-ghn-return`;

    const beRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return NextResponse.json(
      {
        message: responseData.message || "Tạo đơn chiều về thành công",
        order_code: responseData.order_code,
        expected_delivery_time: responseData.expected_delivery_time,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo đơn chiều về:", error);
    return NextResponse.json(
      { error: "Không thể tạo đơn chiều về. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
