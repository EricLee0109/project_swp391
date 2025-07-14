// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const res = await fetch(`${process.env.BE_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("BE Login response:", data);
  
  if (!res.ok) {
    return NextResponse.json({ message: data.message }, { status: 401 });
  }

  const response = NextResponse.json({
    message: "Login successful",
    user: data.user,
  });

  // Set cookies
  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    sameSite: "strict",
    path: "/",
  });
  console.log("Secure cookie:", process.env.NODE_ENV === "production");

  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
