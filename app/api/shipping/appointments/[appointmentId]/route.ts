import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
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
      Authorization: `Bearer ${session.accessToken}`,
    };

    const beRes = await fetch(`${process.env.BE_BASE_URL}/shipping/appointments/${appointmentId}`, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      return NextResponse.json({ error: "Không thể lấy thông tin vận chuyển." }, { status: beRes.status });
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Lỗi server." }, { status: 500 });
  }
}
