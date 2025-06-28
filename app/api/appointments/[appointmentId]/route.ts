import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const params = await context.params;
    const { appointmentId } = params;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Thiếu appointmentId trong URL." },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${appointmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
