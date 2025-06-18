"use client";
import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HeartPulse, SmilePlus } from "lucide-react";
import { notify } from "@/lib/toastNotify";

interface Props {
  cycleId: string;
  defaultSymptoms?: string;
  defaultNotes?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function MenstrualCycleSymptomModal({
  cycleId, defaultSymptoms, defaultNotes, onClose, onSaved
}: Props) {
  const [symptoms, setSymptoms] = useState(defaultSymptoms || "");
  const [notes, setNotes] = useState(defaultNotes || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cycles/${cycleId}/symptoms`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, notes }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      if (onSaved) onSaved();
      onClose();
    } catch {
       notify("error", "Cập nhật thất bại, thử lại!")
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <Card className="animate-modal-content bg-white rounded-2xl shadow-2xl w-full max-w-lg border-none p-0">
        <CardHeader className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 rounded-t-2xl flex items-center gap-3 py-6 px-8">
          <HeartPulse className="w-7 h-7 text-white drop-shadow" />
          <CardTitle className="text-white font-extrabold text-xl drop-shadow">
            Cập nhật triệu chứng chu kỳ
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 px-8">
          <div className="mb-5">
            <Label className="font-semibold text-pink-700 flex items-center gap-2 mb-1">
              <SmilePlus className="inline w-5 h-5 text-pink-400" />
              Triệu chứng
            </Label>
            <Input
              className="border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-lg shadow-sm mt-1"
              placeholder="VD: Đau bụng nhẹ"
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <Label className="font-semibold text-violet-700 flex items-center gap-2 mb-1">
              <SmilePlus className="inline w-5 h-5 text-violet-400" />
              Ghi chú
            </Label>
            <Input
              className="border-violet-300 focus:ring-violet-400 focus:border-violet-400 rounded-lg shadow-sm mt-1"
              placeholder="VD: Tâm trạng khó chịu"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              maxLength={100}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end bg-gray-50 px-8 py-4 rounded-b-2xl">
          <Button onClick={onClose} variant="secondary" className="rounded-lg px-6 font-medium">Hủy</Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-8 font-bold transition"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
