"use server";

import { BE_BASE_URL } from "@/lib/config";
import { auth } from "@/auth";
import { ConsultantProfile } from "@/types/user/User";

export async function getAllConsultantProfiles(): Promise<ConsultantProfile[] | null> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      console.error("Access token not found in session");
      return null;
    }

    const res = await fetch(`${BE_BASE_URL}/auth/profile/consultants/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store", // đảm bảo không cache trên server
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to fetch consultants:", errorData.message || res.statusText);
      return null;
    }

    const data: ConsultantProfile[] = await res.json();
    console.log("BE data consultant", data);
    
    return data;
  } catch (error) {
    console.error("Error fetching consultant profiles:", error);
    return null;
  }
}
export async function getConsultantById(id: string): Promise<ConsultantProfile | null> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      console.error("Access token not found");
      return null;
    }

    const res = await fetch(`${BE_BASE_URL}/auth/profile/consultants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Consultant fetch error:", err.message || res.statusText);
      return null;
    }

    const data: ConsultantProfile = await res.json();
    return data;
  } catch (error) {
    console.error("getConsultantById error:", error);
    return null;
  }
}