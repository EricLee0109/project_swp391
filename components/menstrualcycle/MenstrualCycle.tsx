"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  addDays,
  differenceInDays,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Droplets, Egg, BrainCircuit, Wind } from "lucide-react";

import { notify } from "@/lib/toastNotify";
import MenstrualCycleRecord from "./MenstrualCycleRecord";
import MenstrualCycleSymptomModal from "./MenstrualCycleSymptomModal";
import MenstrualCycleAnalyticsModal from "./MenstrualCycleAnalyticsModal";

interface Cycle {
  cycle_id: string;
  start_date: string;
  period_length: number;
  cycle_length: number;
  ovulation_date?: string;
  symptoms?: string;
  notes?: string;
}

interface Predictions {
  nextCycleStart: string;
  ovulationDate: string;
}

// Helper: Tính ngày rụng trứng theo start_date & ovulation_date API
function getOvulationDay(start_date: string, ovulation_date: string) {
  return (
    differenceInDays(
      startOfDay(parseISO(ovulation_date)),
      startOfDay(parseISO(start_date))
    ) + 1
  );
}

// Helper: Sinh ra phase động đúng thực tế
function getDynamicPhases(
  periodLength: number,
  cycleLength: number,
  ovulationDay: number
) {
  return [
    {
      name: "Kinh nguyệt",
      key: "MENSTRUATION",
      duration: [1, periodLength],
      icon: Droplets,
      color: "#ef4444",
      textColor: "text-red-500",
      symptoms: ["Đau bụng", "Chướng bụng", "Mệt mỏi"],
      description:
        "Niêm mạc tử cung bong ra dẫn đến ra máu kinh. Estrogen và progesterone thấp.",
    },
    {
      name: "Pha nang trứng",
      key: "FOLLICULAR",
      duration: [periodLength + 1, ovulationDay - 1],
      icon: BrainCircuit,
      color: "#60a5fa",
      textColor: "text-blue-500",
      symptoms: ["Tăng năng lượng", "Cải thiện tâm trạng"],
      description:
        "Các nang trứng phát triển, chuẩn bị rụng trứng. Estrogen tăng dần.",
    },
    {
      name: "Rụng trứng",
      key: "OVULATION",
      duration: [ovulationDay, ovulationDay],
      icon: Egg,
      color: "#facc15",
      textColor: "text-amber-500",
      symptoms: ["Đỉnh điểm thụ thai", "Nhiệt độ cơ thể tăng"],
      description:
        "Lượng hormone LH tăng mạnh kích thích trứng chín rụng khỏi buồng trứng.",
    },
    {
      name: "Pha hoàng thể",
      key: "LUTEAL",
      duration: [ovulationDay + 1, cycleLength],
      icon: Wind,
      color: "#a855f7",
      textColor: "text-purple-500",
      symptoms: ["Hội chứng tiền kinh nguyệt (PMS)", "Đau tức ngực", "Thèm ăn"],
      description:
        "Cơ thể sản xuất progesterone, chuẩn bị cho thai kỳ. Có thể xuất hiện triệu chứng PMS.",
    },
  ];
}

function getPhaseForDayDynamic(
  day: number,
  phases: ReturnType<typeof getDynamicPhases>
) {
  return (
    phases.find((p) => day >= p.duration[0] && day <= p.duration[1]) ||
    phases[0]
  );
}

const CycleCalendar = React.memo(
  ({
    selectedDate,
    onSelect,
    phaseModifiers,
  }: {
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    phaseModifiers: Record<string, Date[]>;
  }) => (
    <Card className="shadow-lg dark:bg-gray-800/50">
      <CardHeader>
        <CardTitle>Lịch chu kỳ</CardTitle>
        <CardDescription>Chọn ngày để xem giai đoạn chu kỳ.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          className="p-0"
          modifiers={phaseModifiers}
          modifiersClassNames={{
            menstruation: "day-menstruation",
            follicular: "day-follicular",
            ovulation: "day-ovulation",
            luteal: "day-luteal",
          }}
        />
      </CardContent>
    </Card>
  )
);

CycleCalendar.displayName = "CycleCalendar";

export default function MenstrualCycleTracker() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    startOfDay(new Date())
  );
  const [isClient, setIsClient] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [predictions, setPredictions] = useState<Predictions | null>(null);

  const handleSelectDate = useCallback((date: Date | undefined) => {
    setSelectedDate(date ? startOfDay(date) : undefined);
  }, []);

  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cycles");
      const data = await res.json();
      const sortedCycles = (data.cycles || []).sort(
        (a: Cycle, b: Cycle) =>
          parseISO(b.start_date).getTime() - parseISO(a.start_date).getTime()
      );
      setCycles(sortedCycles);
      setPredictions(data.predictions || null);
    } catch {
      setCycles([]);
    } finally {
      setLoading(false);
    }
  }, []); // Remove selectedDate from dependencies

  useEffect(() => {
    setIsClient(true);
    fetchCycles();
  }, [fetchCycles]);

  // Tìm kỳ ứng với ngày đang chọn
  const currentCycle = useMemo(() => {
    if (!selectedDate || cycles.length === 0) return undefined;
    return cycles.find((cycle, idx) => {
      const start = startOfDay(parseISO(cycle.start_date));
      const end =
        idx === 0
          ? addDays(start, cycle.cycle_length ? cycle.cycle_length - 1 : 27)
          : startOfDay(parseISO(cycles[idx - 1].start_date));
      return (
        !isBefore(startOfDay(selectedDate), start) &&
        isBefore(startOfDay(selectedDate), addDays(end, 1))
      );
    });
  }, [selectedDate, cycles]);

  const anchorDate = currentCycle
    ? startOfDay(parseISO(currentCycle.start_date))
    : undefined;
  const periodLength = currentCycle?.period_length || 5;
  const cycleLength = currentCycle?.cycle_length || 28;

  // Tính ovulationDay theo dữ liệu API, fallback là 14 nếu chưa có ovulation_date
  const ovulationDay = useMemo(() => {
    if (!currentCycle?.ovulation_date || !currentCycle?.start_date) return 14;
    return getOvulationDay(
      currentCycle.start_date,
      currentCycle.ovulation_date
    );
  }, [currentCycle]);

  // Sinh phase đúng tỉ lệ động
  const phases = useMemo(
    () => getDynamicPhases(periodLength, cycleLength, ovulationDay),
    [periodLength, cycleLength, ovulationDay]
  );

  // Tính số ngày trong kỳ (normalize để không lệch timezone)
  const currentDay = useMemo(() => {
    if (!selectedDate || !anchorDate) return 1;
    return differenceInDays(startOfDay(selectedDate), anchorDate) + 1;
  }, [selectedDate, anchorDate]);

  const currentPhaseInfo = useMemo(() => {
    return getPhaseForDayDynamic(currentDay, phases);
  }, [currentDay, phases]);

  // Vẽ wheel theo tỉ lệ động
  const stops = phases.map((p) => {
    const len = p.duration[1] - p.duration[0] + 1;
    return (len / cycleLength) * 100;
  });
  let percent = 0;
  const segments: string[] = [];
  phases.forEach((p, idx) => {
    const from = percent;
    percent += stops[idx];
    segments.push(`${p.color} ${from}% ${percent}%`);
  });
  const conicGradient = `conic-gradient(from -90deg, ${segments.join(", ")})`;

  // Calendar modifiers
  const phaseModifiers = useMemo(() => {
    if (!anchorDate) return {};
    const modifiers: Record<string, Date[]> = {
      menstruation: [],
      follicular: [],
      ovulation: [],
      luteal: [],
    };
    for (let i = 0; i < cycleLength; i++) {
      const date = addDays(anchorDate, i);
      const dayInCycle = i + 1;
      const phase = getPhaseForDayDynamic(dayInCycle, phases);
      if (phase.key === "MENSTRUATION") modifiers.menstruation.push(date);
      else if (phase.key === "FOLLICULAR") modifiers.follicular.push(date);
      else if (phase.key === "OVULATION") modifiers.ovulation.push(date);
      else if (phase.key === "LUTEAL") modifiers.luteal.push(date);
    }
    return modifiers;
  }, [anchorDate, phases, cycleLength]);

  if (!isClient || loading) return null;
  if (!cycles.length)
    return (
      <div className="text-center p-10 text-red-500">
        Chưa có dữ liệu chu kỳ. Vui lòng thiết lập chu kỳ trước.
      </div>
    );

  const handleOpenSymptomModal = () => {
    if (!cycleId) {
      notify("error", "Ngày bạn chọn không thuộc bất kỳ chu kỳ nào!");
      return;
    }
    setShowSymptomModal(true);
  };

  const cycleId = currentCycle?.cycle_id;
  const Icon = currentPhaseInfo.icon;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full flex items-center justify-center p-4 font-work-sans">
      <style>{`
        .day-menstruation { background-color: #ef4444; color: white; border-radius: 9999px; transition: none; }
        .day-follicular { background-color: #60a5fa; color: white; border-radius: 9999px; transition: none; }
        .day-ovulation { background-color: #facc15; color: black; border-radius: 9999px; font-weight: bold; transition: none; }
        .day-luteal { background-color: #a855f7; color: white; border-radius: 9999px; transition: none; }
        .day-menstruation:hover, .day-follicular:hover, .day-ovulation:hover, .day-luteal:hover { opacity: 0.8; }
      `}</style>
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Bảng điều khiển chu kỳ kinh nguyệt
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Hướng dẫn tương tác theo dõi chu kỳ hàng tháng của bạn
          </p>
          {predictions && (
            <div className="mt-4 flex flex-col items-center text-base">
              <div className="flex items-center gap-2">
                <span className="font-medium text-rose-600">
                  Dự đoán kỳ tới:
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(predictions.nextCycleStart).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-600">
                  Dự đoán rụng trứng:
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(predictions.ovulationDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold transition"
              onClick={() => setOpenRecord(true)}
            >
              Ghi nhận kỳ mới
            </button>
            <button
              className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 font-semibold transition"
              onClick={handleOpenSymptomModal}
            >
              Ghi nhận triệu chứng
            </button>
            <button
              className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 font-semibold transition"
              onClick={() => setShowAnalyticsModal(true)}
            >
              Phân tích chu kỳ
            </button>
          </div>
        </header>

        {openRecord && (
          <MenstrualCycleRecord
            onClose={() => setOpenRecord(false)}
            onSuccess={async () => {
              await fetchCycles();
              setOpenRecord(false);
            }}
          />
        )}
        {showSymptomModal && cycleId && (
          <MenstrualCycleSymptomModal
            cycleId={cycleId}
            defaultSymptoms={currentCycle?.symptoms || ""}
            defaultNotes={currentCycle?.notes || ""}
            onClose={() => setShowSymptomModal(false)}
            onSaved={async () => {
              await fetchCycles();
              setShowSymptomModal(false);
            }}
          />
        )}
        {showAnalyticsModal && (
          <MenstrualCycleAnalyticsModal
            onClose={() => setShowAnalyticsModal(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Info */}
          <div className="space-y-6">
            <Card className="shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className={`text-2xl ${currentPhaseInfo.textColor}`}
                    >
                      {currentPhaseInfo.name}
                    </CardTitle>
                    <CardDescription>
                      Ngày {currentPhaseInfo.duration[0]}-
                      {currentPhaseInfo.duration[1]}
                    </CardDescription>
                  </div>
                  <div
                    className={`p-3 rounded-full`}
                    style={{ background: currentPhaseInfo.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  {currentPhaseInfo.description}
                </p>
                <h4 className="font-semibold mb-2">Triệu chứng thường gặp:</h4>
                <ul className="space-y-2">
                  {currentPhaseInfo.symptoms.map((symptom: string) => (
                    <li
                      key={symptom}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-3`}
                        style={{ background: currentPhaseInfo.color }}
                      />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          {/* Center: vòng chu kỳ */}
          <div className="flex items-center justify-center p-1">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div
                className="w-full h-full rounded-full"
                style={{ background: conicGradient }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gray-50 dark:bg-gray-900 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ngày
                </span>
                <span className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                  {currentDay}
                </span>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${currentPhaseInfo.textColor} bg-slate-100`}
                >
                  {currentPhaseInfo.name}
                </Badge>
              </div>
              <div
                className="absolute top-0 left-2 -translate-x-1/2 w-full h-full transition-transform duration-500"
                style={{
                  transform: `rotate(${
                    ((currentDay - 1) / cycleLength) * 360 - 90
                  }deg)`,
                }}
              >
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-500 shadow-lg" />
              </div>
            </div>
          </div>
          {/* Calendar */}
          <div>
            <CycleCalendar
              key={cycleId || "no-cycle"}
              selectedDate={selectedDate}
              onSelect={handleSelectDate}
              phaseModifiers={phaseModifiers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
