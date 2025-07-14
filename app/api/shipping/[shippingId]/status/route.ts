import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ shippingId: string }> }
) {
  try {
    const params = await context.params;
    const { shippingId } = params;

    if (!shippingId) {
      return NextResponse.json({ error: "Thiếu shippingId." }, { status: 400 });
    }

    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    const body = await request.json();
    const { status } = body;

    // Debug: Log request data
    console.log("Request Body:", body);
    console.log("Status to update:", status);

    if (!status) {
      return NextResponse.json({ error: "Thiếu trạng thái." }, { status: 400 });
    }

    const requestPayload = { status };
    console.log("Payload gửi đến backend:", requestPayload);

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/shipping/${shippingId}/status`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(requestPayload),
      }
    );

    const data = await beRes.json();
    console.log("Backend response:", data);

    if (!beRes.ok) {
      return NextResponse.json(
        { error: data.message || "Cập nhật trạng thái thất bại." },
        { status: beRes.status }
      );
    }

    // Debug: So sánh trạng thái
    console.log("Requested status:", status);
    console.log("Returned status:", data.new_status);

    if (data.new_status !== status) {
      return NextResponse.json(
        {
          error: `Không thể cập nhật trạng thái thành ${status}. Trạng thái hiện tại: ${data.new_status}.`,
          new_status: data.new_status,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Cập nhật trạng thái thành công", new_status: data.new_status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Lỗi server." },
      { status: 500 }
    );
  }
}