
"use server";

import { auth } from "@/auth";
import { ViewCreatedCalendarResponse } from "@/types/ViewCreatedCalendar/ViewCreatedCalendar";


export async function getAvailableSchedulesByConsultant(
  consultantId: string
): Promise<ViewCreatedCalendarResponse | null> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      console.error("Access token not found in session");
      return null;
    }

    const res = await fetch(
      `${process.env.BE_BASE_URL}/schedules/consultants/${consultantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error(
        "Failed to fetch consultant schedules:",
        errorData.message || res.statusText
      );
      return null;
    }

    const data: ViewCreatedCalendarResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching consultant schedules:", error);
    return null;
  }
}
