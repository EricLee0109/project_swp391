import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  // const cookieStore = cookies();
  // const accessToken = (await cookieStore).get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (session && session.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  try {
    const beRes = await fetch(`${process.env.BE_BASE_URL}/questions/my`, {
      method: "GET",
      headers,
    });
    if (!beRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch questions list" },
        { status: beRes.status }
      );
    }
    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
