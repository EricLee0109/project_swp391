import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ returnId: string }> }
) {
  try {
    const params = await context.params;
    const { returnId } = params;

    if (!returnId) {
      return NextResponse.json({ error: "Thiếu returnId." }, { status: 400 });
    }

    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Chưa đăng nhập." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Thiếu trường status trong request body." },
        { status: 400 }
      );
    }

    console.log("=== API CALL ===");
    console.log("Requested Status:", status);
    console.log("Return ID:", returnId);

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/shipping/return/${returnId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await beRes.json();

    console.log("=== BACKEND RESPONSE ===");
    console.log("Response Status:", beRes.status);
    console.log("Response Data:", data);

    if (!beRes.ok) {
      if (beRes.status === 401) {
        return NextResponse.json(
          { error: "Token không hợp lệ hoặc hết hạn." },
          { status: 401 }
        );
      }
      throw new Error(
        `Backend trả về lỗi với mã trạng thái ${beRes.status}: ${JSON.stringify(data)}`
      );
    }

    // Use shipping_status instead of new_status
    const returnedStatus = data.shipping_status || data.new_status;

    if (!returnedStatus || returnedStatus !== status) {
      console.log("Status Mismatch: Expected", status, "but received", returnedStatus || "undefined");
      return NextResponse.json(
        {
          error: `Trạng thái không khớp: Yêu cầu ${status}, nhận ${returnedStatus || "undefined"}.`,
          new_status: returnedStatus,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Cập nhật trạng thái thành công", new_status: returnedStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn chiều về:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể cập nhật trạng thái đơn chiều về. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}