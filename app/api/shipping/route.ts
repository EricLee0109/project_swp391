import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    const beRes = await fetch(`${process.env.BE_BASE_URL}/shipping`, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      return NextResponse.json({ error: "Không thể lấy danh sách vận chuyển." }, { status: beRes.status });
    }

    const data = await beRes.json();
    return NextResponse.json({ shippings: data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Lỗi server." }, { status: 500 });
  }
}