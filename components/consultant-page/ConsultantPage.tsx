// app/(root)/consultant/page.tsx
"use client";

import { mockConsultants } from "@/data/consultants";
import ConsultantCard from "./ConsultantCart";

export default function ConsultantPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Hiển thị đúng 3 consultant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockConsultants.slice(0, 3).map((consultant) => (
          <ConsultantCard key={consultant.consultant_id} consultant={consultant} />
        ))}
      </div>
    </div>
  );
}
