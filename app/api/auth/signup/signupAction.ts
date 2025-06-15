// // app/actions/signupAction.ts
// 'use server'

// import { signupToBE } from "@/lib/api/authApi";

// export async function signupAction(fullName: string, email: string, password: string) {
//   return await signupToBE(email, password, fullName);
// }

//----- app/api/auth/signup/route.ts
// import { NextResponse } from "next/server";
// import { signupToBE } from "@/lib/api/authApi";

// export async function POST(request: Request) {
//   try {
//     const { fullName, email, password } = await request.json();
//     console.log("Signup payload:", { fullName, email, password }); // Log input

//     const beData = await signupToBE(email, password, fullName);
//     const { message, data } = beData;

//     return NextResponse.json({ message, data }, { status: 200 });
//   } catch (error) {
//     console.error("Signup error:", error); // Log lỗi chi tiết
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }
