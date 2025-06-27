import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";

export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  const params = await context.params; // Await params
  const { serviceId } = params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const url = `${process.env.BE_BASE_URL}/services/${serviceId}`;
  const beRes = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await beRes.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: beRes.status });
}

export async function DELETE(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  try {
    const params = await context.params; // Await params
    const { serviceId } = params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    if (!serviceId) {
      return NextResponse.json(
        { error: "Thiếu service_id trong URL." },
        { status: 400 }
      );
    }

    const beUrl = `${process.env.BE_BASE_URL}/services/${serviceId}`;
    const beRes = await fetch(beUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    return NextResponse.json(
      { message: "Xóa dịch vụ thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa dịch vụ:", error);
    return NextResponse.json(
      { error: "Không thể xóa dịch vụ. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  try {
    const params = await context.params; // Await params
    const { serviceId } = params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    if (!serviceId) {
      return NextResponse.json(
        { error: "Thiếu service_id trong URL." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedService: Partial<ServicesListType> = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const beUrl = `${process.env.BE_BASE_URL}/services/${serviceId}`;
    const beRes = await fetch(beUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedService),
    });

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();
    return NextResponse.json(
      { message: "Cập nhật dịch vụ thành công", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật dịch vụ:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật dịch vụ. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}