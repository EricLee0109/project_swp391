"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn/ui setup
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Droplets, Egg, BrainCircuit, Wind, LucideProps } from "lucide-react";

// You would typically place these in a separate `components/ui` directory
// For this self-contained example, let's define them here if they aren't globally available.
// In a real Next.js app, you would have already run `npx shadcn-ui@latest init`
// and `npx shadcn-ui@latest add card slider badge`.

// --- Helper Data & Types ---

interface CyclePhase {
  name: string;
  key: "MENSTRUATION" | "FOLLICULAR" | "OVULATION" | "LUTEAL";
  duration: [number, number];
  icon: React.FC<LucideProps>;
  description: string;
  symptoms: string[];
}

const PHASE_COLORS = {
  MENSTRUATION: "bg-red-500",
  FOLLICULAR: "bg-blue-400",
  OVULATION: "bg-amber-400",
  LUTEAL: "bg-purple-500",
};

const PHASE_TEXT_COLORS = {
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
      "The cycle begins with the menstrual phase. The uterus lining is shed, leading to bleeding. Hormone levels like estrogen and progesterone are low.",
    symptoms: ["Cramps", "Bloating", "Fatigue", "Mood swings"],
  },
  {
    name: "Follicular Phase",
    key: "FOLLICULAR",
    duration: [1, 13], // Overlaps with Menstruation
    icon: (props) => <BrainCircuit {...props} />,
    description:
      "During this phase, the pituitary gland releases a hormone (FSH) that stimulates follicles in the ovaries to mature. One follicle becomes dominant and prepares to release an egg. Estrogen levels rise.",
    symptoms: ["Increased energy", "Improved mood", "Clear skin"],
  },
  {
    name: "Ovulation",
    key: "OVULATION",
    duration: [14, 14], // Typically a single day event
    icon: (props) => <Egg {...props} />,
    description:
      "A surge in Luteinizing Hormone (LH) triggers the release of a mature egg from the ovary. This is the most fertile time in the cycle.",
    symptoms: [
      "Peak fertility",
      "Slight rise in basal body temperature",
      "Possible light spotting",
    ],
  },
  {
    name: "Luteal Phase",
    key: "LUTEAL",
    duration: [15, 28],
    icon: (props) => <Wind {...props} />,
    description:
      "After ovulation, the follicle transforms into the corpus luteum, which produces progesterone. This prepares the uterus for a potential pregnancy. If pregnancy doesn't occur, it breaks down, hormone levels drop, and the cycle restarts.",
    symptoms: [
      "Premenstrual syndrome (PMS)",
      "Breast tenderness",
      "Food cravings",
      "Irritability",
    ],
  },
];

// --- Main Component ---

export default function MenstrualCycleTracker() {
  const [cycleLength] = useState(28);
  const [currentDay, setCurrentDay] = useState(12);

  // Memoize calculations to avoid re-running on every render
  const currentPhaseInfo: CyclePhase = useMemo<CyclePhase>(() => {
    let phaseKey: CyclePhase["key"] = "FOLLICULAR"; // Default phase

    if (currentDay === 14) {
      phaseKey = "OVULATION";
    } else if (currentDay > 14) {
      phaseKey = "LUTEAL";
    } else if (currentDay >= 1 && currentDay <= 5) {
      phaseKey = "MENSTRUATION";
    }

    const phase = cyclePhases.find((p) => p.key === phaseKey);

    // Fallback to the first phase in the array if the key isn't found for any reason.
    // This makes the component resilient to data changes and prevents crashes.
    return phase || cyclePhases[0];
  }, [currentDay]);

  const rotationAngle = (currentDay / cycleLength) * 360;

  const conicGradient = useMemo(() => {
    const menstruationEnd =
      ((cyclePhases.find((p) => p.key === "MENSTRUATION")?.duration[1] ?? 5) /
        cycleLength) *
      100;
    const follicularEnd =
      ((cyclePhases.find((p) => p.key === "FOLLICULAR")?.duration[1] ?? 13) /
        cycleLength) *
      100;
    const ovulationPoint =
      ((cyclePhases.find((p) => p.key === "OVULATION")?.duration[0] ?? 14) /
        cycleLength) *
      100;
    const lutealEnd =
      ((cyclePhases.find((p) => p.key === "LUTEAL")?.duration[1] ?? 28) /
        cycleLength) *
      100;

    return `conic-gradient(
      #ef4444 0% ${menstruationEnd}%, 
      #60a5fa ${menstruationEnd}% ${follicularEnd}%, 
      #facc15 ${follicularEnd}% ${ovulationPoint + 1}%, 
      #a855f7 ${ovulationPoint + 1}% ${lutealEnd}%
    )`;
  }, [cycleLength]);

  // Render a dynamic component in JSX
  const Icon = currentPhaseInfo.icon;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Menstrual Cycle Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            An interactive guide to your monthly cycle
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left Side: Visualizer */}
          <div className="lg:col-span-3 flex items-center justify-center p-6">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* The conic gradient circle */}
              <div
                className="w-full h-full rounded-full transition-all duration-500"
                style={{ background: conicGradient }}
              ></div>

              {/* Inner circle creating the donut effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center"></div>

              {/* Central Information */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Day
                </span>
                <span className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                  {currentDay}
                </span>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${PHASE_TEXT_COLORS[currentPhaseInfo.key]}`}
                >
                  {currentPhaseInfo.name}
                </Badge>
              </div>

              {/* The rotating pointer */}
              <div
                className="absolute top-0 left-2 -translate-x-1/2 w-full h-full transition-transform duration-500 ease-in-out"
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
                      {currentPhaseInfo.key === "FOLLICULAR"
                        ? "Days 1-13"
                        : currentPhaseInfo.key === "OVULATION"
                        ? "Around Day 14"
                        : currentPhaseInfo.key === "LUTEAL"
                        ? "Days 15-28"
                        : "Days 1-5"}
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
                      ></div>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle>Cycle Day Selector</CardTitle>
                <CardDescription>
                  Slide to explore different days of the cycle.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Slider
                  defaultValue={[currentDay]}
                  value={[currentDay]}
                  max={cycleLength}
                  min={1}
                  step={1}
                  onValueChange={(value) => setCurrentDay(value[0])}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
