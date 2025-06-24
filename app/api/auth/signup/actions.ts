"use server";

import { BE_BASE_URL } from "@/lib/config";

export async function signupAction(formData: {
  email: string;
  password: string;
  fullName: string;
  otpCode: string;
}) {
  const { email, password, fullName, otpCode } = formData;

  const response = await fetch(`${BE_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName, otpCode }),
  });

  const data = await response.json();
  console.log("BE response:", data); // <-- log BE response để debug

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}
