'use server';

import { BE_BASE_URL } from "@/lib/config";

export async function sendForgotPasswordOtp(email: string): Promise<{ message: string }> {
  const res = await fetch(`${BE_BASE_URL}/auth/forgot-password/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Gửi email khôi phục thất bại");
  }

  return res.json();
}
