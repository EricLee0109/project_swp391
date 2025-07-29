"use client";

import { Heart, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const [heartbeat, setHeartbeat] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Medical emojis for character animation
  const medicalSteps = ["👩‍⚕️", "🩺", "💊", "🏥"];

  useEffect(() => {
    // Heartbeat animation
    const heartInterval = setInterval(() => {
      setHeartbeat((prev) => !prev);
    }, 600);

    // Medical steps animation
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % medicalSteps.length);
    }, 800);

    return () => {
      clearInterval(heartInterval);
      clearInterval(stepInterval);
    };
  }, [medicalSteps.length]);

  return (
    <div className="flex justify-center items-center h-screen bg-white max-w-screen-2xl">
      <div className="flex flex-col items-center gap-8">
        {/* Medical Character Animation */}
        <div className="relative">
          {/* Animated Doctor */}
          <div className="medical-character">
            <div className="doctor-head"></div>
            <div className="doctor-body"></div>
            <div className="stethoscope"></div>
            <div className="doctor-arms">
              <div className="arm arm-left"></div>
              <div className="arm arm-right"></div>
            </div>
            <div className="doctor-legs">
              <div className="leg leg-left"></div>
              <div className="leg leg-right"></div>
            </div>
            {/* Medical bag */}
            <div className="medical-bag"></div>
          </div>

          {/* Floating medical icons */}
          <div className="floating-icons">
            <div className="icon icon-1">💊</div>
            <div className="icon icon-2">🩺</div>
            <div className="icon icon-3">💉</div>
            <div className="icon icon-4">🏥</div>
          </div>
        </div>

        {/* Heartbeat Monitor */}
        <div className="heartbeat-monitor">
          <div className="monitor-screen">
            <svg
              width="200"
              height="60"
              viewBox="0 0 200 60"
              className="ecg-line"
            >
              <path
                d="M 0 30 L 40 30 L 45 10 L 50 50 L 55 20 L 60 30 L 200 30"
                stroke="#22C55E"
                strokeWidth="2"
                fill="none"
                className="heartbeat-line"
              />
            </svg>
            <Heart
              className={`absolute top-2 right-2 w-6 h-6 text-red-500 transition-transform duration-150 ${
                heartbeat ? "scale-125" : "scale-100"
              }`}
            />
          </div>
          <div className="monitor-base"></div>
        </div>

        {/* Medical Process Steps */}
        <div className="process-steps">
          <div className="step-container">
            <div className="text-4xl mb-2 animate-pulse">
              {medicalSteps[currentStep]}
            </div>
            <div className="step-indicator">
              {medicalSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors duration-300 ${
                    index === currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Text with Medical Theme */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Đang xử lý dữ liệu y tế...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Đảm bảo an toàn và bảo mật</span>
          </div>

          {/* Progress pills */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="pill pill-1"></div>
            <div className="pill pill-2"></div>
            <div className="pill pill-3"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .medical-character {
          position: relative;
          width: 80px;
          height: 100px;
          animation: doctor-walk 2s infinite ease-in-out;
        }

        .doctor-head {
          width: 24px;
          height: 24px;
          background: #fef3c7;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 28px;
          border: 2px solid #22c55e;
        }

        .doctor-head::after {
          content: "";
          position: absolute;
          top: -8px;
          left: 4px;
          width: 16px;
          height: 8px;
          background: white;
          border-radius: 8px 8px 0 0;
          border: 2px solid #22c55e;
        }

        .doctor-body {
          width: 20px;
          height: 35px;
          background: white;
          position: absolute;
          top: 24px;
          left: 30px;
          border-radius: 4px;
          border: 2px solid #22c55e;
        }

        .stethoscope {
          position: absolute;
          top: 30px;
          left: 32px;
          width: 16px;
          height: 16px;
          border: 2px solid #6b7280;
          border-radius: 50%;
          background: transparent;
        }

        .stethoscope::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 6px;
          width: 2px;
          height: 8px;
          background: #6b7280;
        }

        .doctor-arms {
          position: absolute;
          top: 28px;
        }

        .arm {
          width: 3px;
          height: 18px;
          background: #fef3c7;
          position: absolute;
          border-radius: 2px;
          transform-origin: top;
        }

        .arm-left {
          left: 26px;
          animation: arm-swing-left 1s infinite ease-in-out;
        }

        .arm-right {
          right: 26px;
          animation: arm-swing-right 1s infinite ease-in-out;
        }

        .doctor-legs {
          position: absolute;
          top: 55px;
        }

        .leg {
          width: 4px;
          height: 25px;
          background: #1f2937;
          position: absolute;
          border-radius: 2px;
          transform-origin: top;
        }

        .leg-left {
          left: 32px;
          animation: leg-walk-left 1s infinite ease-in-out;
        }

        .leg-right {
          right: 32px;
          animation: leg-walk-right 1s infinite ease-in-out;
        }

        .medical-bag {
          width: 12px;
          height: 8px;
          background: #ef4444;
          position: absolute;
          top: 45px;
          left: 20px;
          border-radius: 2px;
          animation: bag-bounce 1s infinite ease-in-out;
        }

        .medical-bag::before {
          content: "+";
          position: absolute;
          top: -2px;
          left: 4px;
          color: white;
          font-size: 8px;
          font-weight: bold;
        }

        .floating-icons {
          position: absolute;
          width: 120px;
          height: 120px;
          top: -20px;
          left: -20px;
        }

        .icon {
          position: absolute;
          font-size: 16px;
          animation: float 3s infinite ease-in-out;
        }

        .icon-1 {
          top: 10px;
          left: 10px;
          animation-delay: 0s;
        }

        .icon-2 {
          top: 10px;
          right: 10px;
          animation-delay: 0.5s;
        }

        .icon-3 {
          bottom: 10px;
          left: 10px;
          animation-delay: 1s;
        }

        .icon-4 {
          bottom: 10px;
          right: 10px;
          animation-delay: 1.5s;
        }

        .heartbeat-monitor {
          position: relative;
          background: #1f2937;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .monitor-screen {
          position: relative;
          background: #000;
          border-radius: 4px;
          padding: 8px;
          overflow: hidden;
        }

        .heartbeat-line {
          animation: ecg-scroll 2s infinite linear;
        }

        .monitor-base {
          width: 100%;
          height: 8px;
          background: #374151;
          border-radius: 0 0 8px 8px;
          position: relative;
        }

        .monitor-base::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 4px;
          background: #22c55e;
          border-radius: 2px;
        }

        .process-steps {
          text-align: center;
        }

        .step-container {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pill {
          width: 20px;
          height: 10px;
          border-radius: 10px;
          margin: 0 2px;
          animation: pill-pulse 1.5s infinite ease-in-out;
        }

        .pill-1 {
          background: #ef4444;
          animation-delay: 0s;
        }

        .pill-2 {
          background: #3b82f6;
          animation-delay: 0.3s;
        }

        .pill-3 {
          background: #10b981;
          animation-delay: 0.6s;
        }

        @keyframes doctor-walk {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes arm-swing-left {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-15deg);
          }
        }

        @keyframes arm-swing-right {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }

        @keyframes leg-walk-left {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-10deg);
          }
        }

        @keyframes leg-walk-right {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes bag-bounce {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
            opacity: 1;
          }
        }

        @keyframes ecg-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20px);
          }
        }

        @keyframes pill-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
