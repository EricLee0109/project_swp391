"use client";

import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarHeart, HeartPulse, StickyNote } from "lucide-react";
import { useState } from "react";
import { notify } from "@/lib/toastNotify";

export interface MenstrualCycleRecordProps {
  onClose: () => void;
  onSuccess?: () => void; // optional callback nếu muốn reload tracker
}

export default function MenstrualCycleRecord({ onClose, onSuccess }: MenstrualCycleRecordProps) {
  const [startDate, setStartDate] = useState("");
  const [periodLength, setPeriodLength] = useState<number | "">("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  // const [isSaved, setIsSaved] = useState(false);

const handleSave = async () => {
  if (!startDate || !periodLength) {
    notify("error", "Vui lòng nhập ngày bắt đầu và số ngày hành kinh!");
    return;
  }
  const payload = {
    startDate,
    periodLength: Number(periodLength),
    symptoms: symptoms || undefined,
    notes: notes || undefined,
  };
  try {
    const res = await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Parse response để lấy message nếu lỗi
    const data = await res.json();

    if (!res.ok) {
      // Ưu tiên lấy message BE trả về, fallback nếu không có
      notify("error", data?.message || "Ghi nhận chu kỳ thất bại!");
      return;
    }

    notify("success", "Ghi nhận chu kỳ thành công!");
    onClose();
    if (onSuccess) onSuccess();
  } catch {
    notify("error", "Ghi nhận chu kỳ thất bại. Vui lòng thử lại!");
  }
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl border-none p-0 animate-fadeIn">
        <CardHeader className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 rounded-t-2xl py-6 px-8 flex items-center gap-3">
          <CalendarHeart className="w-7 h-7 text-white drop-shadow" />
          <CardTitle className="text-white font-extrabold text-xl drop-shadow">
            Ghi nhận chu kỳ mới
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 px-8 space-y-5">
          <div>
            <Label htmlFor="cycle-date" className="font-semibold text-pink-700 flex gap-2">
              <CalendarHeart className="inline w-5 h-5 text-pink-400" />
              Ngày bắt đầu
            </Label>
            <Input
              id="cycle-date"
              type="date"
              className="mt-1 rounded-lg border-pink-300 focus:ring-pink-400 focus:border-pink-400 shadow"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="period-length" className="font-semibold text-fuchsia-700 flex gap-2">
              <HeartPulse className="inline w-5 h-5 text-fuchsia-400" />
              Số ngày hành kinh
            </Label>
            <Input
              id="period-length"
              type="number"
              className="mt-1 rounded-lg border-fuchsia-300 focus:ring-fuchsia-400 focus:border-fuchsia-400 shadow"
              value={periodLength}
              min={2}
              max={7}
              placeholder="2-7"
              onChange={e => setPeriodLength(Number(e.target.value) || "")}
            />
          </div>
          <div>
            <Label htmlFor="symptoms" className="font-semibold text-violet-700 flex gap-2">
              <HeartPulse className="inline w-5 h-5 text-violet-400" />
              Triệu chứng (tuỳ chọn)
            </Label>
            <Input
              id="symptoms"
              className="mt-1 rounded-lg border-violet-300 focus:ring-violet-400 focus:border-violet-400 shadow"
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Ví dụ: Đau bụng nhẹ"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="notes" className="font-semibold text-purple-700 flex gap-2">
              <StickyNote className="inline w-5 h-5 text-purple-400" />
              Ghi chú (tuỳ chọn)
            </Label>
            <Input
              id="notes"
              className="mt-1 rounded-lg border-purple-300 focus:ring-purple-400 focus:border-purple-400 shadow"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tâm trạng khó chịu"
              maxLength={100}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end bg-gray-50 px-8 py-4 rounded-b-2xl">
          <Button variant="secondary" onClick={onClose} className="rounded-lg px-6 font-medium">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-8 font-bold transition"
          >
            Ghi nhận
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
