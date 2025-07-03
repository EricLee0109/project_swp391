import { getAllConsultantProfiles } from "./action";

// export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getAllConsultantProfiles();
    return Response.json(profiles);
  } catch {
    return Response.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
