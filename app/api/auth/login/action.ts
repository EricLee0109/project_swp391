//LoginAction.tsx
"use server";

import { BE_BASE_URL } from "@/lib/config";

export interface LoginFormData {
  email: string;
  password: string;
}

export async function loginAction(formData: LoginFormData) {
  const { email, password } = formData;

  try {
    const response = await fetch(`${BE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log("📦 BE response (Login):", data);

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("🔥 Login BE error:", error);
    throw error;
  }
}
