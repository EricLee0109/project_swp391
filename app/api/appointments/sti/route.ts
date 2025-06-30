import { NextResponse } from "next/server";
import { CreateStiAppointmentDto } from "@/types/ServiceType/CustomServiceType";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const body: CreateStiAppointmentDto = await request.json();

    // Validate required fields for STI
    if (!body.serviceId || !body.date || !body.session || !body.selected_mode) {
      return NextResponse.json(
        {
          error:
            "Thiếu các trường bắt buộc (serviceId, date, session, selected_mode)",
        },
        { status: 400 }
      );
    }

    // Get accessToken from cookies
    const session = await auth();

    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    // Check if accessToken is present
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    // Forward request to backend API
    const url = `${process.env.BE_BASE_URL}/appointments/sti`;
    const beRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!beRes.ok) {
      const errorBody = await beRes.text();
      console.error("Backend error:", beRes.status, errorBody);
      if (beRes.status === 401) {
        return NextResponse.json(
          {
            error:
              "Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          },
          { status: 401 }
        );
      }
      throw new Error(
        `Backend trả về lỗi với mã trạng thái ${beRes.status}: ${errorBody}`
      );
    }

    const responseData = await beRes.json();

    return NextResponse.json(
      { message: "Đặt lịch xét nghiệm STI thành công", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo lịch xét nghiệm STI:", error);
    return NextResponse.json(
      { error: "Không thể tạo lịch xét nghiệm STI. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
