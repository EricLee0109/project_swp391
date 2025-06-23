import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface CreateAppointmentDto {
  consultant_id?: string;
  schedule_id?: string;
  service_id: string;
  type: string;
  location: string;
  related_appointment_id: string | null;
  contact_name?: string;
  contact_phone?: string;
  shipping_address?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateAppointmentDto = await request.json();

    // Validate required fields
    if (!body.service_id) {
      return NextResponse.json(
        { error: "Thiếu ID dịch vụ" },
        { status: 400 }
      );
    }

    // Get accessToken from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // Check if accessToken is present
    if (!accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // Forward request to backend API
    const url = `${process.env.BE_BASE_URL}/appointments`;
    const beRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          { error: "Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." },
          { status: 401 }
        );
      }
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();

    return NextResponse.json(
      { message: "Đặt lịch hẹn thành công", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo lịch hẹn:", error);
    return NextResponse.json(
      { error: "Không thể tạo lịch hẹn. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}