import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: { testCode: string; fullName: string } = await request.json();

    // Validate required fields
    if (!body.testCode || !body.fullName) {
      return NextResponse.json(
        { error: "Thiếu các trường bắt buộc (testCode, fullName)" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward request to backend API
    const url = `${process.env.BE_BASE_URL}/appointments/results`;
    const beRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          {
            error: "Không thể truy cập dữ liệu. Vui lòng kiểm tra lại thông tin.",
          },
          { status: 401 }
        );
      }
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();

    return NextResponse.json(
      { message: "Lấy kết quả xét nghiệm thành công", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi lấy kết quả xét nghiệm:", error);
    return NextResponse.json(
      { error: "Không thể lấy kết quả xét nghiệm. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}