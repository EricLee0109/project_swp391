import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  try {
    const beRes = await fetch(`${process.env.BE_BASE_URL}/appointments/consultant-appointments`, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      console.error("Backend response error:", await beRes.text());
      return NextResponse.json(
        { message: "Failed to fetch consultant appointments" },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}