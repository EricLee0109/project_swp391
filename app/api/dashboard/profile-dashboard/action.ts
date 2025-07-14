"use server";

import { auth } from "@/auth";
import { ConsultantProfile } from "@/types/user/User";
// import { BE_BASE_URL } from "@/lib/config";


// GET /api/auth/profile/consultant
export async function getMyConsultantProfile(): Promise<ConsultantProfile | null> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      console.error("Access token not found.");
      return null;
    }

    const res = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/consultant`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("GET /consultant error:", error.message || res.statusText);
      return null;
    }

    const data: ConsultantProfile = await res.json();
    console.log("CONSULTANT PROFILE:", data); // 👈 THÊM DÒNG NÀY

    return data;
  } catch (error) {
    console.error("Error fetching consultant profile:", error);
    return null;
  }
}

// PATCH /api/auth/profile/consultant
export async function updateConsultantProfile(data: {
  qualifications?: string;
  experience?: string;
  specialization?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, message: "Access token missing" };
    }

    const res = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/consultant`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return { success: false, message: error.message || "Update failed" };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Update consultant error:", error);
    if (typeof error === "object" && error && "message" in error) {
      return {
        success: false,
        message: (error as { message?: string }).message || "Unknown error",
      };
    }
    return { success: false, message: "Unknown error" };
  }
}
