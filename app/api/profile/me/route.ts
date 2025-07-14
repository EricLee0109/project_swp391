// app/api/auth/profile/me/route.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(session.accessToken, JWT_SECRET) as {
      sub: string;
    };
    console.log("User ID:", decoded.sub);

    const beRes = await fetch(`${process.env.BE_BASE_URL}/auth/profile/me`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await beRes.json();
    console.log("BE Profile data:", data);

    return NextResponse.json(data, { status: beRes.status });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// ✅ PATCH profile
export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const beRes = await fetch(`${process.env.BE_BASE_URL}/auth/profile/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await beRes.json();

    if (!beRes.ok) {
      return NextResponse.json(
        { error: data.message || "Update failed" },
        { status: beRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
