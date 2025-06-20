import { Schedule } from "@/types/ServiceType/HealthServiceType";

export const schedulesData: Schedule[] = [
  {
    consultant_id: "con001",
    schedule_id: "sch001",
    date: "2025-06-23",
    time_slots: ["09:00", "10:00", "14:00"],
  },
  {
    consultant_id: "con001",
    schedule_id: "sch002",
    date: "2025-06-24",
    time_slots: ["11:00", "15:00"],
  },
  {
    consultant_id: "con002",
    schedule_id: "sch003",
    date: "2025-06-23",
    time_slots: ["09:30", "10:30"],
  },
];
