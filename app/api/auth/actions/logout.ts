// app/api/auth/actions/logout.ts
"use server";

import { signOut } from "@/auth";

export async function logout() {
  // const cookieStore = await cookies();

  // cookieStore.delete("accessToken");
  // cookieStore.delete("refreshToken");
  signOut({ redirectTo: "/" });
}
