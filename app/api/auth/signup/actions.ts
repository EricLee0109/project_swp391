"use server";

import { BE_BASE_URL } from "@/lib/config";

import { signIn } from "next-auth/react";



export async function signupAction(formData: {
  email: string;
  password: string;
  fullName: string;
}) {
  const { email, password, fullName } = formData;

  const response = await fetch(`${BE_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });

  const data = await response.json();
 console.log("BE response:", data);  // <-- log tay vào đây
  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}
