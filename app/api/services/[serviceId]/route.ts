import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  const params = await context.params; // Await params
  const { serviceId } = params;
  // console.log("serviceId param:", serviceId); // LOG 1
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const url = `${process.env.BE_BASE_URL}/services/${serviceId}`;
  // console.log("Requesting BE:", url, headers); // LOG 2

  const beRes = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await beRes.text();
  // console.log("BE Response status:", beRes.status, text); // LOG 3

  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: beRes.status });
}