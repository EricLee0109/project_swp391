import { NextResponse } from "next/server";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (session?.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  const beRes = await fetch(`${process.env.BE_BASE_URL}/services`, {
    method: "GET",
    headers,
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const newService: ServicesListType = {
      service_id: crypto.randomUUID(), // Giả lập ID, backend sẽ sinh nếu có
      name: body.name,
      description: body.description,
      price: body.price.toString(), // Chuyển number thành string
      category: body.category,
      is_active: body.is_active,
      type: body.type,
      testing_hours: null, // Giả định backend tự thêm nếu cần
      daily_capacity: 10, // Giá trị mặc định, có thể thay đổi
      return_address: body.return_address || null,
      return_phone: body.return_phone || null,
      available_modes: body.available_modes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      filter: function (arg0: (s: any) => boolean): ServicesListType[] {
        throw new Error("Function not implemented.");
      },
    };

    // Gửi request đến backend
    const url = `${process.env.BE_BASE_URL}/services`;
    const beRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(newService),
    });

    if (!beRes.ok) {
      throw new Error(`Backend trả về lỗi với mã trạng thái ${beRes.status}`);
    }

    const responseData = await beRes.json();
    return NextResponse.json(
      { message: "Tạo dịch vụ thành công", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo dịch vụ:", error);
    return NextResponse.json(
      { error: "Không thể tạo dịch vụ. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
