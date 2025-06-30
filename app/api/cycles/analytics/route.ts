import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("timeRange") || "3months";

  const session = await auth();
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (session?.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  const beRes = await fetch(
    `${process.env.BE_BASE_URL}/cycles/analytics?timeRange=${timeRange}`,
    {
      method: "GET",
      headers,
    }
  );

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}
