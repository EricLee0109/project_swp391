import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken)
    headers["Authorization"] = `Bearer ${session.accessToken}`;

  try {
    const body = await req.json();
    console.log("Batch request body:", body);

    // Validate required fields
    if (!body.start_time || !body.end_time || !body.duration_minutes || !body.service_id) {
      return NextResponse.json(
        {
          message: "Missing required fields (start_time, end_time, duration_minutes, service_id)",
        },
        { status: 400 }
      );
    }

    // Validate duration_minutes
    if (body.duration_minutes < 15 || body.duration_minutes > 120) {
      return NextResponse.json(
        { message: "Thời lượng slot phải từ 15 đến 120 phút" },
        { status: 400 }
      );
    }

    const beRes = await fetch(`${process.env.BE_BASE_URL}/schedules/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      const errorData = await beRes.json();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to create batch schedules" },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/schedules/batch:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}