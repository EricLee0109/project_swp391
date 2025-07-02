import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const params = await context.params;
    const { appointmentId } = params;

    if (!appointmentId) {
      return NextResponse.json({ error: "Thiếu appointmentId." }, { status: 400 });
    }

    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/shipping/appointments/${appointmentId}/order-ghn`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({}), // Body rỗng
      }
    );

    const data = await beRes.json();
    if (!beRes.ok) {
      return NextResponse.json({ error: data?.error || "Không thể tạo đơn vận chuyển." }, { status: beRes.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server." }, { status: 500 });
  }
}
