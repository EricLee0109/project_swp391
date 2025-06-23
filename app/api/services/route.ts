import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const beRes = await fetch(`${process.env.BE_BASE_URL}/services`, {
    method: "GET",
    headers,
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}
