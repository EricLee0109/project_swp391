import { getMyConsultantProfile } from "@/app/api/dashboard/profile-dashboard/action";

export async function GET() {
  try {
    const profile = await getMyConsultantProfile();
    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }
    return Response.json(profile);
  } catch {
    return Response.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
