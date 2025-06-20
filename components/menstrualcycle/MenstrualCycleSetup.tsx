"use client";

import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, HeartPulse } from "lucide-react";
import { notify } from "@/lib/toastNotify";

export interface MenstrualCycleSetupProps {
  onClose: (cycleCreated?: boolean) => void; // truyền true nếu đã setup xong
}

export default function MenstrualCycleSetup({ onClose }: MenstrualCycleSetupProps) {
  // Kỳ gần nhất
  const [lastCycleStartDate, setLastCycleStartDate] = useState("");
  const [lastPeriodLength, setLastPeriodLength] = useState<number | "">("");
  // Kỳ trước đó
  const [prevCycleStartDate, setPrevCycleStartDate] = useState("");
  const [prevPeriodLength, setPrevPeriodLength] = useState<number | "">("");
  // const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSave = async () => {
  if (
    !lastCycleStartDate ||
    !lastPeriodLength ||
    !prevCycleStartDate ||
    !prevPeriodLength
  ) {
    notify("error", "Vui lòng nhập đầy đủ thông tin cho 2 kỳ kinh gần nhất!")
    return;
  }
  setLoading(true);
  const payload = {
    startDate: lastCycleStartDate,
    periodLength: Number(lastPeriodLength),
    previousCycles: [
      {
        startDate: prevCycleStartDate,
        periodLength: Number(prevPeriodLength),
      },
    ],
  };
  try {
    const res = await fetch("/api/cycles/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Không thể lưu thiết lập!");

    notify("success", "Đã lưu thành công!");
    onClose(true); // báo đã setup xong
  } catch {
    notify("error", "Không thể lưu thiết lập. Vui lòng thử lại!")
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl animate-fadeIn border-none bg-white">
        <CardHeader className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 rounded-t-2xl py-6 px-8 flex items-center gap-3">
          <CalendarCheck2 className="w-7 h-7 text-white drop-shadow" />
          <CardTitle className="text-white font-bold text-xl drop-shadow">
            Thiết lập chu kỳ kinh nguyệt
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 px-8 space-y-5">
          <CardDescription className="mb-2 text-base text-gray-700">
            Nhập thông tin về <span className="text-pink-500 font-semibold">2 kỳ kinh gần nhất</span> để hệ thống dự đoán chu kỳ chính xác cho bạn.
          </CardDescription>
          {/* Kỳ gần nhất */}
          <div className="rounded-xl border bg-gray-50/80 dark:bg-gray-900/50 p-4 space-y-3 border-pink-100">
            <div className="font-semibold mb-2 flex gap-2 items-center text-pink-600">
              <CalendarCheck2 className="w-5 h-5" />
              Kỳ kinh gần nhất
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-cycle-start-date">Ngày bắt đầu</Label>
              <Input
                id="last-cycle-start-date"
                type="date"
                value={lastCycleStartDate}
                onChange={(e) => setLastCycleStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-period-length">Số ngày hành kinh</Label>
              <Input
                id="last-period-length"
                type="number"
                value={lastPeriodLength}
                min={2}
                max={7}
                onChange={(e) => setLastPeriodLength(Number(e.target.value) || "")}
                placeholder="2-7"
              />
            </div>
          </div>
          {/* Kỳ liền trước */}
          <div className="rounded-xl border bg-gray-50/80 dark:bg-gray-900/50 p-4 space-y-3 border-fuchsia-100">
            <div className="font-semibold mb-2 flex gap-2 items-center text-fuchsia-600">
              <HeartPulse className="w-5 h-5" />
              Kỳ kinh trước đó
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prev-cycle-start-date">Ngày bắt đầu</Label>
              <Input
                id="prev-cycle-start-date"
                type="date"
                value={prevCycleStartDate}
                onChange={(e) => setPrevCycleStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prev-period-length">Số ngày hành kinh</Label>
              <Input
                id="prev-period-length"
                type="number"
                value={prevPeriodLength}
                min={2}
                max={7}
                onChange={(e) => setPrevPeriodLength(Number(e.target.value) || "")}
                placeholder="2-7"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end bg-gray-50 px-8 py-4 rounded-b-2xl">
          <Button variant="outline" onClick={() => onClose(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg px-8"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thiết lập"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
