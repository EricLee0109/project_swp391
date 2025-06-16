"use server";

import { BE_BASE_URL } from "@/lib/config";

// Interface khai báo dữ liệu nhận vào form:
export interface LoginFormData {
  email: string;
  password: string;
}

// Interface cho response từ BE trả về:
export interface LoginResponse {
   message?: string; // <-- thêm dòng này
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: string;
    email: string;
    full_name: string;
    role: string;
    phone_number?: string | null;
    address?: string | null;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
  };
}

export async function loginAction(formData: LoginFormData): Promise<LoginResponse> {
  const { email, password } = formData;

  try {
    const response = await fetch(`${BE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    console.log("📦 BE response (Login):", data);

    if (!response.ok) {
      throw new Error(data?.message ?? "Login failed");

    }

    return data;
  } catch (error) {
    console.error("🔥 Login BE error:", error);
    throw error;
  }
}
