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
          error: "Thiếu các trường bắt buộc (serviceId, date, session, selected_mode)",
        },
        { status: 400 }
      );
    }

    // Get accessToken from cookies
    const session = await auth();

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
    const backendRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const result = await backendRes.json(); // Parse response body once

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: result.message || "Something went wrong" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      { message: "Đặt lịch xét nghiệm STI thành công", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo lịch xét nghiệm STI:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể tạo lịch xét nghiệm STI. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}