// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Đăng xuất thành công" })

  response.cookies.set("accessToken", "", {
    maxAge: 0,
    path: "/",
  })
  response.cookies.set("refreshToken", "", {
    maxAge: 0,
    path: "/",
  })

  return response
}
