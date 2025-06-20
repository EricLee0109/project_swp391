"use client";
import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, CalendarDays, HeartPulse } from "lucide-react";

interface Props {
  onClose: () => void;
}
interface Analytics {
  averageCycleLength: number;
  averagePeriodLength: number;
  chartData: { date: string; cycleLength: number; symptoms: string }[];
}

export default function MenstrualCycleAnalyticsModal({ onClose }: Props) {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("3months");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cycles/analytics?timeRange=${range}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <Card className="animate-modal-content bg-white shadow-2xl border-none rounded-2xl w-full max-w-lg p-0">
        <CardHeader className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 rounded-t-2xl text-white py-6 px-8 shadow-md">
          <div className="flex items-center gap-3">
            <BarChart4 className="w-8 h-8" />
            <CardTitle className="text-2xl font-extrabold drop-shadow">
              Phân tích dữ liệu chu kỳ
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-6 px-8">
          <div className="mb-5 flex gap-3 items-center">
            <label className="font-semibold text-gray-700">Thời gian:</label>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-pink-400"
            >
              <option value="3months">3 tháng</option>
              <option value="6months">6 tháng</option>
              <option value="1year">1 năm</option>
            </select>
          </div>
          {loading && <div className="text-center text-pink-500 font-semibold py-5">Đang tải dữ liệu...</div>}
          {data && (
            <div>
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1 bg-pink-50 border border-pink-200 rounded-xl shadow px-4 py-3 flex items-center gap-3">
                  <CalendarDays className="w-7 h-7 text-pink-400" />
                  <div>
                    <div className="text-xs text-pink-500">Trung bình độ dài chu kỳ</div>
                    <div className="font-bold text-xl text-pink-700">{data.averageCycleLength} <span className="text-sm">ngày</span></div>
                  </div>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl shadow px-4 py-3 flex items-center gap-3">
                  <HeartPulse className="w-7 h-7 text-amber-400" />
                  <div>
                    <div className="text-xs text-amber-600">Trung bình số ngày hành kinh</div>
                    <div className="font-bold text-xl text-amber-700">{data.averagePeriodLength} <span className="text-sm">ngày</span></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2 text-violet-700">Lịch sử gần nhất:</div>
                <ul className="space-y-3">
                  {data.chartData.map((c) => (
                    <li key={c.date} className="flex gap-2 items-center text-sm text-gray-700">
                      <span className="inline-block w-2 h-2 bg-pink-400 rounded-full mt-1"></span>
                      <span className="font-medium">{new Date(c.date).toLocaleDateString()}</span>
                      <span className="text-gray-500">| Chu kỳ: <span className="font-bold">{c.cycleLength}</span> ngày</span>
                      <span className="text-gray-500">| Triệu chứng: <span className="font-normal">{c.symptoms || <span className="italic text-gray-400">Không ghi nhận</span>}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end bg-gray-50 px-8 py-4 rounded-b-2xl">
          <Button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-5 font-semibold rounded-lg">
            Đóng
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
