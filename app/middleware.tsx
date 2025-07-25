// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Example using NextAuth.js

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;
  // Example: Protect admin routes
  if (
    pathname.startsWith(`/${token?.role.toLowerCase()}`) &&
    (!token || token.role !== "Admin")
  ) {
    return NextResponse.redirect(new URL(`/${token?.role}/dashboard`, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/staff/:path*",
    "/consultant/:path*",
  ], // Apply middleware to admin routes
};
