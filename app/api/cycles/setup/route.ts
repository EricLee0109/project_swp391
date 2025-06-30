// app/api/cycles/setup/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // 1. Lấy dữ liệu từ request body
    const data = await req.json();

    // 2. Lấy accessToken từ cookie
    const session = await auth();

    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    // 3. Chuẩn bị headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }

    // 4. Gửi request đến backend
    const backendRes = await fetch(`${process.env.BE_BASE_URL}/cycles/setup`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      // credentials: "include", // KHÔNG cần khi dùng SSR (API route)
    });

    // 5. Lấy dữ liệu trả về từ backend
    const result = await backendRes.json();

    // 6. Nếu lỗi thì trả về status tương ứng (ví dụ 401)
    if (!backendRes.ok) {
      return NextResponse.json(
        { message: result.message || "Something went wrong" },
        { status: backendRes.status }
      );
    }

    // 7. Trả về kết quả thành công cho FE
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
