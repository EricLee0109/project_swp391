import { NextResponse } from "next/server";

export async function GET() {
  const beRes = await fetch(`${process.env.BE_BASE_URL}/services`, {
    method: "GET",
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}