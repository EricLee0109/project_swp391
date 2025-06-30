"use server";

import { BE_BASE_URL } from "@/lib/config";
import { auth } from "@/auth";

interface ChangeUserRolePayload {
  userId: string;
  newRole: string;
}

export async function changeUserRole({
  userId,
  newRole,
}: ChangeUserRolePayload): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    // const cookieStore = await cookies();
    // const token = cookieStore.get("accessToken")?.value;

    if (!session?.accessToken) {
      return { success: false, message: "Không tìm thấy access token" };
    }

    const response = await fetch(`${BE_BASE_URL}/auth/change-role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`, // ✅ THÊM TOKEN VÀO ĐÂY
      },
      body: JSON.stringify({ userId, newRole }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Đổi vai trò thất bại",
      };
    }

    return { success: true, message: data.message || "Đổi vai trò thành công" };
  } catch (error) {
    console.error("Lỗi khi đổi vai trò:", error);
    return { success: false, message: "Lỗi kết nối máy chủ" };
  }
}
