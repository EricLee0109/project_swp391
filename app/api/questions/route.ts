import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  // const cookieStore = cookies();
  // const accessToken = (await cookieStore).get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (session && session.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  try {
    const beRes = await fetch(`${process.env.BE_BASE_URL}/questions/assigned`, {
      method: "GET",
      headers,
    });
    if (!beRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch questions list" },
        { status: beRes.status }
      );
    }
    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.formData();

    // Validate required fields
    if (
      !body.get("consultant_id") ||
      !body.get("category") ||
      !body.get("title") ||
      !body.get("content")
    ) {
      return NextResponse.json(
        {
          error:
            "Thiếu các trường bắt buộc (title, content, category, consultant_id)",
        },
        { status: 400 }
      );
    }

    const session = await auth();

    // Check if accessToken is present
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      //   "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    // Forward request to backend API
    const url = `${process.env.BE_BASE_URL}/questions`;
    const beRes = await fetch(url, {
      method: "POST",
      headers,
      body: body,
    });

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          {
            error:
              "Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          },
          { status: 401 }
        );
      }
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();

    return NextResponse.json(
      { message: "Gửi câu hỏi thành công", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi gửi câu hỏi:", error);
    return NextResponse.json(
      { error: "Không thể gửi câu hỏi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
