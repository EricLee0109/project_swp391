import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/types/ServiceType/HealthServiceType";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authJWT() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;

    return { user: decoded };
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return null;
  }
}
