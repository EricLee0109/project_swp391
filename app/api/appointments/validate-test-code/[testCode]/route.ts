
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request, context: { params: Promise<{ testCode: string }> }) {
  try {
    const params = await context.params;
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const url = `${process.env.BE_BASE_URL}/appointments/validate-test-code/${params.testCode}`;
    const beRes = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      const errorBody = await beRes.text();
      console.error("Backend error:", beRes.status, errorBody);
      if (beRes.status === 401) {
        return NextResponse.json({ error: "Token xác thực không hợp lệ. Vui lòng đăng nhập lại." }, { status: 401 });
      }
      throw new Error(`Backend error: ${beRes.status}`);
    }

    const responseData = await beRes.json();

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã:", error);
    return NextResponse.json({ error: "Không thể kiểm tra mã. Vui lòng thử lại." }, { status: 500 });
  }
}