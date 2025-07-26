import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const session = await auth();
    const { appointmentId } = await context.params;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { notes, meeting_link } = body;

    console.log("Received body:", body); // Debug log

    // Validate required fields
    if (!notes || notes.trim() === "") {
      return NextResponse.json(
        { error: "Ghi chú là bắt buộc." },
        { status: 400 }
      );
    }

    // Prepare request body
    const requestBody: { notes: string; meeting_link?: string } = {
      notes: notes.trim(),
    };

    // Chỉ thêm meeting_link nếu có giá trị
    if (meeting_link && meeting_link.trim()) {
      requestBody.meeting_link = meeting_link.trim();
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const url = `${process.env.BE_BASE_URL}/appointments/${appointmentId}/confirm`;
    const beRes = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(requestBody),
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