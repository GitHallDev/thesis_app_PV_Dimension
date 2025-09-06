// components/InclinationDial.tsx

import React, { useCallback, useState } from "react";
import { Input } from "./ui/input";

interface InclinationDialProps {
  inclination: number;
  onChange: (value: number) => void;
}

const RADIUS = 80;

const InclinationDial: React.FC<InclinationDialProps> = () => {
  const [inclination, setInclination] = useState(90);

  const handleInclinationChange = useCallback((angle: number) => {
    const clampedAngle = Math.max(0, Math.min(90, angle));
    setInclination(clampedAngle);
  }, []);

  const getInclinationPoint = () => {
    const radius = 80;
    const centerX = 150;
    const centerY = 150;
    const angleRad = (inclination * Math.PI) / 180;
    const x = centerX + radius * Math.cos(Math.PI - angleRad);
    const y = centerY - radius * Math.sin(Math.PI - angleRad);
    return { x, y };
  };

  const handleInclinationDrag = (event: React.MouseEvent<SVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const centerX = 150;
    const centerY = 150;
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      let angle = (Math.atan2(-y, -x) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      if (angle > 180) angle = 180;
      if (angle < 0) angle = 0;
      handleInclinationChange(angle);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const inclinationPoint = getInclinationPoint();

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Inclinaison</h3>
      <div className="relative mb-6">
        <svg
          width="300"
          height="200"
          viewBox="0 0 300 200"
          className="mx-auto cursor-pointer"
          onMouseDown={handleInclinationDrag}
        >
          {/* Horizon line */}
          <line
            x1="60"
            y1="150"
            x2="240"
            y2="150"
            stroke="#666"
            strokeWidth="1"
          />
          {/* Zenith line */}
          <line
            x1="150"
            y1="60"
            x2="150"
            y2="150"
            stroke="#666"
            strokeWidth="1"
          />
          {/* Arc */}
          <path
            d="M 70 150 A 80 80 0 0 1 230 150"
            fill="none"
            stroke="#ddd"
            strokeWidth="1"
          />
          {/* Filled area */}
          <path
            d={`M 150 150 L ${inclinationPoint.x} ${inclinationPoint.y} A 80 80 0 0 1 150 70 Z`}
            fill="#e5e5e5"
            opacity="0.3"
          />
          {/* Angle line */}
          <line
            x1="150"
            y1="150"
            x2={inclinationPoint.x}
            y2={inclinationPoint.y}
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Interactive point */}
          <circle
            cx={inclinationPoint.x}
            cy={inclinationPoint.y}
            r="5"
            fill="#2563eb"
            className="cursor-pointer hover:fill-blue-400"
          />
          {/* Labels */}
          <text
            x="100"
            y="170"
            textAnchor="middle"
            className="text-sm fill-gray-600"
          >
            horizon
          </text>
          <text
            x="150"
            y="50"
            textAnchor="middle"
            className="text-sm fill-gray-600"
          >
            zénith
          </text>
        </svg>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <span className="text-lg font-medium text-gray-700">°</span>
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="90"
            value={inclination}
            onChange={(e) =>
              handleInclinationChange(parseInt(e.target.value) || 0)
            }
            className="w-20 text-center border-gray-300 !rounded-button text-sm"
          />
          <i className="fas fa-sort absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default InclinationDial;
