import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const beRes = await fetch(`${process.env.BE_BASE_URL}/cycles`, {
    method: "GET",
    headers,
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Đọc body từ FE
  const body = await req.json();

  const beRes = await fetch(`${process.env.BE_BASE_URL}/cycles`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}
