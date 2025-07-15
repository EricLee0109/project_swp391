  // app/api/auth/profile/me/route.ts
  import jwt from "jsonwebtoken";
  import { NextResponse } from "next/server";
  import { auth } from "@/auth";

  const JWT_SECRET = process.env.JWT_SECRET!;

  export async function GET() {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(session.accessToken, JWT_SECRET) as {
        sub: string;
      };
      console.log("User ID:", decoded.sub);

      const beRes = await fetch(`${process.env.BE_BASE_URL}/auth/profile/me`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const data = await beRes.json();
    

      return NextResponse.json(data, { status: beRes.status });
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // ✅ PATCH profile
 export async function PATCH(req: Request) {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData(); // Sử dụng FormData

        const payload = new FormData();
        payload.append("fullName", formData.get("fullName") as string || "");
        payload.append("phoneNumber", formData.get("phoneNumber") as string || "");
        payload.append("address", formData.get("address") as string || "");
        payload.append("dateOfBirth", formData.get("dateOfBirth") as string || "");
        payload.append("gender", formData.get("gender") as string || "");
        payload.append("medicalHistory", formData.get("medicalHistory") as string || "");
        payload.append("privacySettings", formData.get("privacySettings") as string || "{}");
        
        // Thêm hình ảnh nếu có
        const imageFile = formData.get("image") as File;
        if (imageFile) {
            payload.append("image", imageFile);
        }

        console.log("Dữ liệu cập nhật:", payload); // Log để kiểm tra

        const beRes = await fetch(`${process.env.BE_BASE_URL}/auth/profile/me`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                // Không cần thiết phải đặt "Content-Type" cho FormData
            },
            body: payload, // Gửi FormData
        });

        const data = await beRes.json();
        console.log("Update profile response:", data);
        if (!beRes.ok) {
            return NextResponse.json(
                { error: data.message || "Update failed" },
                { status: beRes.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
