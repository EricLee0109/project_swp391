import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(request: Request, { params }: { params: { appointmentId: string } }) {
  try {
    const session = await auth();

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

    const url = `${process.env.BE_BASE_URL}/appointments/${params.appointmentId}/confirm`;
    const beRes = await fetch(url, {
      method: "PATCH",
      headers,
    });

    if (!beRes.ok) {
      const err = await beRes.json();
      return NextResponse.json(
        { error: err.message || "Xác nhận lịch hẹn thất bại." },
        { status: beRes.status }
      );
    }

    const responseData = await beRes.json();
    return NextResponse.json(
      { message: "Xác nhận lịch hẹn thành công!", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xác nhận lịch hẹn:", error);
    return NextResponse.json(
      { error: "Không thể xác nhận lịch hẹn. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}