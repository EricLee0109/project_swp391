import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Token từ cookie:", token);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      user_id: string;
    };
    console.log("User ID từ token:", decoded.user_id);
    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/customer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await beRes.json();
    return NextResponse.json(data, { status: beRes.status });
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
