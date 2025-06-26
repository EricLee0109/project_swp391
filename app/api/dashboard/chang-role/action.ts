"use server";

import { BE_BASE_URL } from "@/lib/config";

interface ChangeUserRolePayload {
  userId: string;
  newRole: string;
}


export async function changeUserRole({
  userId,
  newRole,
}: ChangeUserRolePayload): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BE_BASE_URL}/auth/change-role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newRole }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Đổi vai trò thất bại" };
    }

    const data = await response.json();
    return { success: true, message: data.message || "Đổi vai trò thành công" };
  } catch (error) {
    console.error("Lỗi khi đổi vai trò:", error);
    return { success: false, message: "Lỗi kết nối máy chủ" };
  }
}
