import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    const beRes = await fetch(`${process.env.BE_BASE_URL}/schedules`, {
      method: "GET",
      headers,
    });

    if (!beRes.ok) {
      console.error("Backend response error:", await beRes.text()); // Debug lỗi từ backend
      return NextResponse.json({ message: "Failed to fetch schedules" }, { status: beRes.status });
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    const body = await req.json();
    console.log("Request body:", body); // Debug body

    // Validate required fields
    if (!body.start_time || !body.end_time || !body.service_id) {
      return NextResponse.json(
        { message: "Missing required fields (start_time, end_time, service_id)" },
        { status: 400 }
      );
    }

    const beRes = await fetch(`${process.env.BE_BASE_URL}/schedules`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      const errorData = await beRes.json();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to create schedule" },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Error in POST /api/schedules:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}