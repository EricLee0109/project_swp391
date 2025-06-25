'use server';

import { BE_BASE_URL } from "@/lib/config";

export async function resetPasswordWithOtp({
  email,
  otpCode,
  newPassword,
}: {
  email: string;
  otpCode: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${BE_BASE_URL}/auth/forgot-password/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otpCode, newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Đặt lại mật khẩu thất bại");
  }

  return res.json();
}
