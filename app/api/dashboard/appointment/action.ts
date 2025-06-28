"use server";

import { cookies } from "next/headers"; // nếu bạn dùng Next.js app router
import { BE_BASE_URL } from "@/lib/config";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { redirect } from "next/navigation";

export async function getAllAppointment(): Promise<AppointmentListType[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
    // throw new Error("Không tìm thấy token, bạn chưa đăng nhập?");
  }

  const res = await fetch(`${BE_BASE_URL}/appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Lỗi khi lấy danh sách các cuộc hẹn");
  }

  return res.json();
}
