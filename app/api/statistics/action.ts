"use server";

import { BE_BASE_URL } from "@/lib/config";
import { auth } from "@/auth";
import { AppointmentStats, CustomerServiceUsageStats, CycleStats, QuestionStats, RevenueStats, ServiceStats, TestResultStats, UserStats } from "@/types/statistics/statistics";


async function fetchWithToken<T>(url: string): Promise<T> {
  const session = await auth();
  if (!session?.accessToken) throw new Error("Chưa đăng nhập");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Lỗi API thống kê");
  }

  return res.json();
}

// =======================
// Các hàm gọi API thống kê
// =======================

export async function getAppointmentStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/appointments${query ? `?${query}` : ""}`;
  return fetchWithToken<AppointmentStats>(url);
}

export async function getTestResultStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/test-results${query ? `?${query}` : ""}`;
  return fetchWithToken<TestResultStats>(url);
}

export async function getServiceStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/services${query ? `?${query}` : ""}`;
  return fetchWithToken<ServiceStats>(url);
}

export async function getCycleStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/cycles${query ? `?${query}` : ""}`;
  return fetchWithToken<CycleStats>(url);
}

export async function getUserStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/users${query ? `?${query}` : ""}`;
  return fetchWithToken<UserStats>(url);
}

export async function getQuestionStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/questions${query ? `?${query}` : ""}`;
  return fetchWithToken<QuestionStats>(url);
}

export async function getRevenueStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/revenue${query ? `?${query}` : ""}`;
  return fetchWithToken<RevenueStats>(url);
}

export async function getCustomerServiceUsageStats(query?: string) {
  const url = `${BE_BASE_URL}/stats/customers/service-usage${query ? `?${query}` : ""}`;
  return fetchWithToken<CustomerServiceUsageStats>(url);
}
