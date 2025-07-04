import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
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
    };

    const beRes = await fetch(`${process.env.BE_BASE_URL}/shipping/${shippingId}`, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn vận chuyển", error: "Not Found", statusCode: 404 },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Lỗi server." }, { status: 500 });
  }
}

