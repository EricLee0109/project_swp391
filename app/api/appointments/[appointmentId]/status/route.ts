import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
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

    const body = await request.json();
    const session = await auth();

    // const cookieStore = cookies();
    // const accessToken = (await cookieStore).get("accessToken")?.value;

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

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!beRes.ok) {
      const errorData = await beRes.json();
      throw new Error(errorData.message || `Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();
    return NextResponse.json(
      { message: "Cập nhật trạng thái thành công", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Không thể cập nhật trạng thái." },
      { status: 500 }
    );
  }
}
