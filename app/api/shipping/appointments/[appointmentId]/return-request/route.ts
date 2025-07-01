import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
    request: Request,
    context: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const params = await context.params;
        const { appointmentId } = params;

        if (!appointmentId) {
            return NextResponse.json({ error: "Thiếu appointmentId." }, { status: 400 });
        }

        const session = await auth();
        if (!session?.accessToken) {
            return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
        }

        const headers: Record<string, string> = {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
        };

        const beRes = await fetch(
            `${process.env.BE_BASE_URL}/shipping/appointments/${appointmentId}/return-request`,
            {
                method: "POST",
                headers,
            }
        );

        if (!beRes.ok) {
            const err = await beRes.json();
            return NextResponse.json(
                { error: err.error || "Tạo yêu cầu trả mẫu thất bại." },
                { status: beRes.status }
            );
        }

        const data = await beRes.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Lỗi API trả mẫu:", error);
        return NextResponse.json(
            { error: "Lỗi server khi tạo yêu cầu trả mẫu." },
            { status: 500 }
        );
    }
}
