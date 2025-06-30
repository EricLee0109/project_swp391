"use server";

import { BE_BASE_URL } from "@/lib/config";
import { User } from "@/types/user/User";
import { auth } from "@/auth";

export async function getAllUsers(): Promise<User[]> {
  const session = await auth();

  // const cookieStore = await cookies();
  // const token = cookieStore.get("accessToken")?.value;

  if (!session?.accessToken) {
    throw new Error("Không tìm thấy token, bạn chưa đăng nhập?");
  }

  const res = await fetch(`${BE_BASE_URL}/auth/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });
  // console.log("BE", res);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Lỗi khi lấy danh sách người dùng");
  }

  return res.json();
}
