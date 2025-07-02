import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const params = await context.params;
    const { appointmentId } = params;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Thiếu appointmentId trong URL." },
        { status: 400 }
      );
    }
    const session = await auth();

    // const cookieStore = cookies();
    // const accessToken = (await cookieStore).get("accessToken")?.value;
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${appointmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    return NextResponse.json(
      { message: "Xoá lịch hẹn thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xoá lịch hẹn:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể xoá lịch hẹn." },
      { status: 500 }
    );
  }
  
}

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const { appointmentId } = params;

    if (!appointmentId) {
      return NextResponse.json({ error: "Thiếu appointmentId." }, { status: 400 });
    }

    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const beRes = await fetch(`${process.env.BE_BASE_URL}/appointments/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!beRes.ok) {
      const errText = await beRes.text();
      return NextResponse.json(
        { error: `Lỗi backend: ${beRes.status} - ${errText}` },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch hẹn:", error);
    return NextResponse.json(
      { error: "Lỗi server khi lấy chi tiết lịch hẹn." },
      { status: 500 }
    );
  }
}