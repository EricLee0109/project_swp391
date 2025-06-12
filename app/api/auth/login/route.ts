import { NextResponse } from "next/server";
import { loginToBE } from "@/lib/api/authApi";
// This route handles user login requests

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const beData = await loginToBE(email, password);

    return NextResponse.json(
      { message: "Login successful", data: beData },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
