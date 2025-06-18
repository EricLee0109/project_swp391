"use client";

import React, { useState } from "react";
import MenstrualCycleTracker from "@/components/MenstrualCycle";
import MenstrualCycleSetup from "@/components/MenstrualCycleSetup";

export default function MenstrualCyclePage() {
  const [isSetupOpen, setIsSetupOpen] = useState(true);

  // Function to close the modal
  const handleCloseSetup = () => {
    setIsSetupOpen(false);
  };

  return (
    <>
      <div className="section">
        {/* The tracker will be visible in the background */}
        <MenstrualCycleTracker />
      </div>

      {/* Conditionally render the setup modal */}
      {isSetupOpen && <MenstrualCycleSetup onClose={handleCloseSetup} />}
    </>
  );
}
