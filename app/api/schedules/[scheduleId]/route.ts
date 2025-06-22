import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req: Request, { params }: { params: { scheduleId: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    const scheduleId = params.scheduleId;
    const beRes = await fetch(`${process.env.BE_BASE_URL}/schedules/${scheduleId}`, {
      method: "DELETE",
      headers,
    });

    if (!beRes.ok) {
      const errorData = await beRes.json();
      console.error("Delete error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to delete schedule" },
        { status: beRes.status }
      );
    }

    return NextResponse.json({ message: "Schedule deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/schedules/:scheduleId:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { scheduleId: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    const scheduleId = params.scheduleId;
    const body = await req.json();
    console.log("PATCH body:", body); // Debug body

    // Validate required fields
    if (!body.start_time || !body.end_time || !body.service_id) {
      return NextResponse.json(
        { message: "Missing required fields (start_time, end_time, service_id)" },
        { status: 400 }
      );
    }

    const beRes = await fetch(`${process.env.BE_BASE_URL}/schedules/${scheduleId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!beRes.ok) {
      const errorData = await beRes.json();
      console.error("Patch error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to update schedule" },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/schedules/:scheduleId:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}