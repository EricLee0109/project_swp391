import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const session = await auth();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  try {
    const resolvedParams = await params;
    const { appointmentId } = resolvedParams;

    if (!appointmentId) {
      return NextResponse.json(
        { message: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Get request body
    const body = await req.json();
    console.log("API /appointments/[appointmentId]/complete called with:", {
      appointmentId,
      body
    });

    // Validate consultation_notes
    if (!body.consultation_notes || body.consultation_notes.trim() === "") {
      return NextResponse.json(
        { message: "Consultation notes are required" },
        { status: 400 }
      );
    }

    const beRes = await fetch(
      `${process.env.BE_BASE_URL}/appointments/${appointmentId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          consultation_notes: body.consultation_notes.trim()
        }),
      }
    );

    if (!beRes.ok) {
      const errorData = await beRes.json();
      console.error("Backend response error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to complete consultation" },
        { status: beRes.status }
      );
    }

    const data = await beRes.json();
    return NextResponse.json(
      { message: "Consultation completed successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/appointments/[appointmentId]/complete:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}