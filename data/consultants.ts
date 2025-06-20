import { Consultant } from "@/types/ServiceType/HealthServiceType";

export const consultantsData: Consultant[] = [
  {
    consultant_id: "con001",
    user_id: "user001",
    user: {
      user_id: "user001",
      full_name: "Dr. Emily Carter",
      email: "emily.carter@health.com",
      avatar: "https://placehold.co/100x100/E91E63/FFFFFF?text=EC",
    },
    specialization: "Gynecologist",
    is_verified: true,
    experience: "10+ years",
  },
  {
    consultant_id: "con002",
    user_id: "user002",
    user: {
      user_id: "user002",
      full_name: "Dr. James Wilson",
      email: "james.wilson@health.com",
      avatar: "https://placehold.co/100x100/2196F3/FFFFFF?text=JW",
    },
    specialization: "Urologist",
    is_verified: false,
    experience: "8 years",
  },
];
