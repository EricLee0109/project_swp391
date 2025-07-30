"use client";
import React, { useState, useEffect } from "react";

import MenstrualCycleSetup from "@/components/menstrualcycle/MenstrualCycleSetup";
import MenstrualCycleTracker from "@/components/menstrualcycle/MenstrualCycle";

export default function MenstrualCyclePage() {
  const [loading, setLoading] = useState(true);
  const [hasCycle, setHasCycle] = useState(false);
  const [setupKey, setSetupKey] = useState(0); // để trigger re-render tracker

  useEffect(() => {
    const checkCycles = async () => {
      try {
        const res = await fetch("/api/cycles");
        const data = await res.json();
        setHasCycle(!!(data.cycles && data.cycles.length));
      } catch {
        setHasCycle(false);
      } finally {
        setLoading(false);
      }
    };
    checkCycles();
  }, [setupKey]);

  // Khi setup xong thì hiển thị tracker (không reload trang)
  const handleCloseSetup = (cycleCreated?: boolean) => {
    if (cycleCreated) {
      setSetupKey((k) => k + 1); // force lại useEffect => fetch lại data
      setHasCycle(true);
    }
  };

  if (loading) return null; // hoặc spinner

  return (
    <div className="h-screen">
      {hasCycle ? (
        <MenstrualCycleTracker key={setupKey} />
      ) : (
        <MenstrualCycleSetup onClose={handleCloseSetup} />
      )}
    </div>
  );
}
