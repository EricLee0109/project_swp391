import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const beRes = await fetch(`${process.env.BE_BASE_URL}/cycles`, {
    method: "GET",
    headers,
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}

export async function POST(req: Request) {
  const session = await auth();

  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
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
