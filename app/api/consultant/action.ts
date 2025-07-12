"use server";

// import { BE_BASE_URL } from "@/lib/config";
import { auth } from "@/auth";
import { ConsultantProfile } from "@/types/user/User";

export async function getAllConsultantProfiles(): Promise<
  ConsultantProfile[] | null
> {
  try {
    // const session = await auth();

    // if (!session?.accessToken) {
    //   console.error("Access token not found in session");
    //   return null;
    // }

    const res = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/consultants/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session.accessToken}`,
          //not need accessToken to this API
        },
        cache: "no-store", // đảm bảo không cache trên server
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error(
        "Failed to fetch consultants:",
        errorData.message || res.statusText
      );
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

export async function updateConsultantProfile(data: {
  qualifications?: string;
  experience?: string;
  specialization?: string;
}): Promise<{ success: boolean } | { success: false; message: string }> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, message: "Access token not found" };
    }

    const res = await fetch(
      `${process.env.BE_BASE_URL}/auth/profile/consultant`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message || "Update failed" };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating consultant profile:", error);
    if (typeof error === "object" && error && "message" in error) {
      return {
        success: false,
        message: (error as { message?: string }).message || "Unknown error",
      };
    }
    return { success: false, message: "Unknown error" };
  }
}
