'use server';

import { cookies } from "next/headers"; // nếu bạn dùng Next.js app router
import { BE_BASE_URL } from "@/lib/config";
import { User } from "@/types/user/User";

export async function getAllUsers(): Promise<User[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) {
    throw new Error("Không tìm thấy token, bạn chưa đăng nhập?");
  }

  const res = await fetch(`${BE_BASE_URL}/auth/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Lỗi khi lấy danh sách người dùng");
  }

  return res.json();
}
