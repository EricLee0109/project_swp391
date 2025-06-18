// "use server";

// import { cookies } from "next/headers";
// import { BE_BASE_URL } from "@/lib/config";

// export interface LoginFormData {
//   email: string;
//   password: string;
// }

// export async function loginAction({ email, password }: LoginFormData) {
//   const res = await fetch(`${BE_BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   const cookieStore = await cookies();

//   cookieStore.set("accessToken", data.accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60, // 1 hour
//     path: "/",
//     sameSite: "strict",
//   });

//   cookieStore.set("refreshToken", data.refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     path: "/",
//     sameSite: "strict",
//   });

//   return { success: true };
// }
