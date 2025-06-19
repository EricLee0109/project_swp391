import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: Request, context: { params: Promise<{ cycleId: string }> }) {
  const { cycleId } = await context.params; // PHẢI await ở đây!
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const body = await req.json();

  const beRes = await fetch(`${process.env.BE_BASE_URL}/cycles/${cycleId}/symptoms`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  const data = await beRes.json();
  return NextResponse.json(data, { status: beRes.status });
}
