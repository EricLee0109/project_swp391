import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const session = await auth();

  // const cookieStore = await cookies();
  // const token = cookieStore.get("accessToken")?.value;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Token từ cookie:", session.accessToken);

  try {
    const decoded = jwt.verify(session.accessToken, JWT_SECRET) as {
      user_id: string;
    };
    console.log("User ID từ token:", decoded.user_id);
    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/customer`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
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
