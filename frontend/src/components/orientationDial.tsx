// components/OrientationDial.tsx

import React, { useCallback, useState } from "react";
import { Input } from "./ui/input";

interface OrientationDialProps {
  orientation: number;
  onChange: (value: number) => void;
}

const RADIUS = 80;

const OrientationDial: React.FC<OrientationDialProps> = () => {
  const [orientation, setOrientation] = useState(0);

  const handleOrientationChange = useCallback((angle: number) => {
    setOrientation(angle);
  }, []);

  const getOrientationPoint = () => {
    const radius = 80;
    const centerX = 150;
    const centerY = 150;
    const angleRad = ((orientation - 90) * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return { x, y };
  };
  const handleOrientationDrag = (event: React.MouseEvent<SVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const centerX = 150;
    const centerY = 150;
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;
      if (angle >= 360) angle -= 360;
      handleOrientationChange(Math.round(angle));
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const orientationPoint = getOrientationPoint();

  const largeAngle = orientation > 180 ? 1 : 0;
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Orientation</h3>
      <div className="relative mb-6">
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="mx-auto cursor-pointer"
          onMouseDown={handleOrientationDrag}
        >
          {/* Circle */}
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="none"
            stroke="#ddd"
            strokeWidth="2"
          />
          {/* Filled area for orientation */}
          <path
            d={`M 150 150 L 150 70 A 80 80 0 ${largeAngle} 1 ${orientationPoint.x} ${orientationPoint.y} Z`}
            fill="#e5e5e5"
            opacity="0.3"
          />
          {/* Cardinal lines */}
          <line
            x1="150"
            y1="60"
            x2="150"
            y2="240"
            stroke="#ddd"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="150"
            x2="240"
            y2="150"
            stroke="#ddd"
            strokeWidth="1"
          />
          {/* Orientation line */}
          <line
            x1="150"
            y1="150"
            x2={orientationPoint.x}
            y2={orientationPoint.y}
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Interactive point */}
          <circle
            cx={orientationPoint.x}
            cy={orientationPoint.y}
            r="5"
            fill="#2563eb"
            className="cursor-pointer hover:fill-blue-600"
          />
          {/* Cardinal labels */}
          <text
            x="150"
            y="45"
            textAnchor="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            N
          </text>
          <text
            x="150"
            y="260"
            textAnchor="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            S
          </text>
          <text
            x="45"
            y="155"
            textAnchor="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            W
          </text>
          <text
            x="255"
            y="155"
            textAnchor="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            E
          </text>
        </svg>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <span className="text-lg font-medium text-gray-700">°</span>
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="359"
            value={orientation}
            onChange={(e) =>
              handleOrientationChange(parseInt(e.target.value) || 0)
            }
            className="w-20 text-center border-gray-300 !rounded-button text-sm"
          />
          <i className="fas fa-sort absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default OrientationDial;
