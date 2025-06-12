import { BE_BASE_URL } from "@/lib/config";

// Hàm gọi API đăng nhập tới backend
export async function loginToBE(email: string, password: string) {
  const response = await fetch(`${BE_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}
