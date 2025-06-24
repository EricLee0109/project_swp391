// app/api/auth/signupotp/action.ts

'use server';

import { BE_BASE_URL } from "@/lib/config";

export async function sendOtp(email: string): Promise<{ message: string }> {
  const res = await fetch(`${BE_BASE_URL}/auth/signup/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Gửi OTP thất bại");
  }

  return res.json();
}
