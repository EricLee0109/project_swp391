import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Get accessToken from cookies
    const session = await auth();

    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    // Check if accessToken is present
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    // Kiểm tra xác thực bằng authJWT
    // const session = await authJWT();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        },
        { status: 401 }
      );
    }

    // Gửi request đến backend API
    const url = `${process.env.BE_BASE_URL}/appointments/my-appointments`;
    const beRes = await fetch(url, {
      method: "GET",
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
        message: "Lấy danh sách lịch hẹn thành công",
        appointments: responseData.appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách lịch hẹn. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
