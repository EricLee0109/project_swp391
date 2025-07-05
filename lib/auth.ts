import jwt from "jsonwebtoken";
import { User } from "@/types/ServiceType/HealthServiceType";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authJWT() {
  const authReq = await auth();
  const token = authReq?.accessToken;
  // const cookieStore = await cookies();
  // const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;

    return { user: decoded || null };
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return redirect("/login");
  }
}
