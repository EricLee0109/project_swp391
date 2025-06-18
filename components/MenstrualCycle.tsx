"use client";

import React, { useState, useMemo, useEffect } from "react";
import { addDays, differenceInDays, startOfMonth } from "date-fns";
import type { LucideProps } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // <-- Import Calendar
import { Badge } from "@/components/ui/badge";
import { Droplets, Egg, BrainCircuit, Wind } from "lucide-react";

// --- TypeScript Types ---

interface CyclePhase {
  name: string;
  key: "MENSTRUATION" | "FOLLICULAR" | "OVULATION" | "LUTEAL";
  duration: [number, number];
  icon: React.FC<LucideProps>;
  description: string;
  symptoms: string[];
}

// --- Helper Data & Configuration ---

const CYCLE_LENGTH = 28;

const PHASE_COLORS: Record<CyclePhase["key"], string> = {
  MENSTRUATION: "bg-red-500",
  FOLLICULAR: "bg-blue-400",
  OVULATION: "bg-amber-400",
  LUTEAL: "bg-purple-500",
};

const PHASE_TEXT_COLORS: Record<CyclePhase["key"], string> = {
  MENSTRUATION: "text-red-500",
  FOLLICULAR: "text-blue-500",
  OVULATION: "text-amber-500",
  LUTEAL: "text-purple-500",
};

const cyclePhases: CyclePhase[] = [
  {
    name: "Menstruation",
    key: "MENSTRUATION",
    duration: [1, 5],
    icon: (props) => <Droplets {...props} />,
    description:
      "The uterus lining is shed, leading to bleeding. Estrogen and progesterone are low.",
    symptoms: ["Cramps", "Bloating", "Fatigue"],
  },
  {
    name: "Follicular Phase",
    key: "FOLLICULAR",
    duration: [6, 13],
    icon: (props) => <BrainCircuit {...props} />,
    description:
      "After menstruation, the pituitary gland stimulates follicles to mature, preparing one to release an egg. Estrogen rises.",
    symptoms: ["Increased energy", "Improved mood"],
  },
  {
    name: "Ovulation",
    key: "OVULATION",
    duration: [14, 14],
    icon: (props) => <Egg {...props} />,
    description:
      "A surge in Luteinizing Hormone (LH) triggers the release of a mature egg. This is the most fertile time.",
    symptoms: ["Peak fertility", "Rise in temperature"],
  },
  {
    name: "Luteal Phase",
    key: "LUTEAL",
    duration: [15, 28],
    icon: (props) => <Wind {...props} />,
    description:
      "The body produces progesterone to prepare the uterus for a potential pregnancy. PMS symptoms can occur.",
    symptoms: ["PMS", "Breast tenderness", "Cravings"],
  },
];

const getPhaseForDay = (day: number): CyclePhase["key"] => {
  if (day >= 1 && day <= 5) return "MENSTRUATION";
  if (day > 5 && day <= 13) return "FOLLICULAR";
  if (day === 14) return "OVULATION";
  if (day > 14 && day <= CYCLE_LENGTH) return "LUTEAL";
  return "FOLLICULAR"; // Default fallback
};

// --- Main Component ---

export default function MenstrualCycleTracker() {
  // FIX: Initialize date-dependent state to null to prevent hydration errors.
  const [cycleAnchorDate, setCycleAnchorDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  // FIX: Use useEffect to set date values only on the client-side after mounting.
  useEffect(() => {
    const today = new Date();
    // For this demo, the cycle anchor is the start of the current month.
    // In a real app, this would come from user data.
    setCycleAnchorDate(startOfMonth(today));
    setSelectedDate(today); // Default selected date to today.
    setIsClient(true);
  }, []);

  // The current day of the cycle is derived from the selected calendar date
  const currentDay = useMemo(() => {
    if (!selectedDate || !cycleAnchorDate) return 1;
    // Calculate the total number of days passed since the anchor date.
    const dayDifference = differenceInDays(selectedDate, cycleAnchorDate);

    // Use a modulo formula that correctly handles negative numbers for past dates.
    // This ensures the day in the cycle is always a positive number from 1 to 28.
    const dayInCycle =
      ((dayDifference % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;

    return dayInCycle + 1; // Return a 1-based day number (1-28)
  }, [selectedDate, cycleAnchorDate]);

  const currentPhaseInfo = useMemo<CyclePhase>(() => {
    const phaseKey = getPhaseForDay(currentDay);
    return cyclePhases.find((p) => p.key === phaseKey) || cyclePhases[0];
  }, [currentDay]);

  // The rotation angle now points to the middle of the day's segment, not the end.
  const rotationAngle = ((currentDay - 0.5) / CYCLE_LENGTH) * 360;

  const conicGradient = useMemo(() => {
    // Define precise percentage stops for the end of each phase for accuracy.
    const menstruationEnd = (5 / CYCLE_LENGTH) * 100;
    const follicularEnd = (13 / CYCLE_LENGTH) * 100;
    const ovulationEnd = (14 / CYCLE_LENGTH) * 100; // End of Day 14
    const lutealEnd = (28 / CYCLE_LENGTH) * 100;

    return `conic-gradient(
      from -90deg,
      #ef4444 0% ${menstruationEnd}%, 
      #60a5fa ${menstruationEnd}% ${follicularEnd}%, 
      #facc15 ${follicularEnd}% ${ovulationEnd}%, 
      #a855f7 ${ovulationEnd}% ${lutealEnd}%
    )`;
  }, []);

  // Define modifiers for the Calendar component to color-code the days
  const phaseModifiers = useMemo(() => {
    if (!cycleAnchorDate) return {}; // Return empty modifiers if date is not set

    const modifiers: Record<string, Date[]> = {
      menstruation: [],
      follicular: [],
      ovulation: [],
      luteal: [],
    };

    for (let i = -CYCLE_LENGTH; i < CYCLE_LENGTH * 2; i++) {
      // Generate for past, current, and next month
      const date = addDays(cycleAnchorDate, i);
      const dayOfCycle =
        (((i % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH) + 1;
      const phase = getPhaseForDay(dayOfCycle);

      if (phase === "MENSTRUATION") {
        modifiers.menstruation.push(date);
      } else if (phase === "FOLLICULAR") {
        modifiers.follicular.push(date);
      } else if (phase === "OVULATION") {
        modifiers.ovulation.push(date);
      } else if (phase === "LUTEAL") {
        modifiers.luteal.push(date);
      }
    }
    return modifiers;
  }, [cycleAnchorDate]);

  // FIX: Render nothing on the server and on initial client render before useEffect runs.
  // This prevents the server/client HTML mismatch.
  if (!isClient) {
    return null;
  }

  const Icon = currentPhaseInfo.icon;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <style>{`
        .day-menstruation { background-color: #ef4444; color: white; border-radius: 9999px; }
        .day-follicular { background-color: #60a5fa; color: white; border-radius: 9999px; }
        .day-ovulation { background-color: #facc15; color: black; border-radius: 9999px; font-weight: bold; }
        .day-luteal { background-color: #a855f7; color: white; border-radius: 9999px; }
        .day-menstruation:hover, .day-follicular:hover, .day-ovulation:hover, .day-luteal:hover { opacity: 0.8; }
      `}</style>
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Menstrual Cycle Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            An interactive guide to your monthly cycle
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Side: Visualizer */}
          <div className="lg:col-span-3 flex items-center justify-center p-6">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div
                className="w-full h-full rounded-full"
                style={{ background: conicGradient }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gray-50 dark:bg-gray-900 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Day
                </span>
                <span className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                  {currentDay}
                </span>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${
                    PHASE_TEXT_COLORS[currentPhaseInfo.key]
                  } bg-slate-100`}
                >
                  {currentPhaseInfo.name}
                </Badge>
              </div>
              <div
                className="absolute top-0 left-2 -translate-x-1/2 w-full h-full transition-transform duration-500"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-500 shadow-lg" />
              </div>
            </div>
          </div>

          {/* Right Side: Information and Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className={`text-2xl ${
                        PHASE_TEXT_COLORS[currentPhaseInfo.key]
                      }`}
                    >
                      {currentPhaseInfo.name}
                    </CardTitle>
                    <CardDescription>
                      Days {currentPhaseInfo.duration[0]}-
                      {currentPhaseInfo.duration[1]}
                    </CardDescription>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      PHASE_COLORS[currentPhaseInfo.key]
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  {currentPhaseInfo.description}
                </p>
                <h4 className="font-semibold mb-2">Common Symptoms & Notes:</h4>
                <ul className="space-y-2">
                  {currentPhaseInfo.symptoms.map((symptom) => (
                    <li
                      key={symptom}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-3 ${
                          PHASE_COLORS[currentPhaseInfo.key]
                        }`}
                      />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle>Cycle Calendar</CardTitle>
                <CardDescription>
                  Select a date to see the corresponding cycle day.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
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
          </div>
        </div>
      </div>
    </div>
  );
}
