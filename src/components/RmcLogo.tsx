'use client';
import React from 'react';

interface RmcLogoProps {
  theme: 'light' | 'dark';
  className?: string;
}

export const RmcLogo: React.FC<RmcLogoProps> = ({ theme, className = "h-8" }) => {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#3A3A3A';

  return (
    <div className={`flex items-center gap-2 ${className}`} id="rmc-logo">
      <svg
        viewBox="0 0 540 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Letter 'R' with Red Scooter and motion lines */}
        <g id="letter-R">
          {/* Main vertical stem of R */}
          <path
            d="M50 30 H95 V80 H50 Z"
            fill={textColor}
          />
          <path
            d="M50 100 H95 V130 H50 Z"
            fill={textColor}
          />
          {/* Top loop of R */}
          <path
            d="M95 30 H140 C165 30 180 45 180 65 C180 85 165 95 140 95 H110"
            stroke={textColor}
            strokeWidth="24"
            strokeLinecap="square"
            fill="none"
          />
          {/* Leg of R */}
          <path
            d="M125 95 L175 130"
            stroke={textColor}
            strokeWidth="24"
            strokeLinecap="square"
          />
          
          {/* Scooter Silhouette & Speed Trails in Red */}
          <g id="red-scooter" transform="translate(10, 5)">
            {/* Horizontal speed trails */}
            <path
              d="M10 75 H55 M0 85 H50 M15 95 H45"
              stroke="#D72626"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Scooter body & wheels */}
            <path
              d="M50 88 C55 88 60 84 63 76 L75 50 C77 45 82 42 88 42 H110 L115 50 L125 45 M110 42 L105 34 H100 M65 80 C70 65 85 62 95 72 L108 85 C112 89 118 89 122 84 C126 80 128 72 125 66"
              stroke="#D72626"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Front wheel */}
            <circle cx="122" cy="85" r="9" fill={textColor} stroke="#D72626" strokeWidth="6" />
            {/* Rear wheel area */}
            <circle cx="60" cy="85" r="9" fill={textColor} stroke="#D72626" strokeWidth="6" />
          </g>
        </g>

        {/* Letter 'M' - clean, thick, premium sans-serif layout */}
        <g id="letter-M">
          <path
            d="M210 30 H235 L265 85 L295 30 H320 V130 H295 V70 L265 120 L235 70 V130 H210 Z"
            fill={textColor}
          />
        </g>

        {/* Letter 'C' - clean, thick circular geometry */}
        <g id="letter-C">
          <path
            d="M440 45 C420 32 390 32 370 45 C350 60 345 90 360 110 C375 128 405 132 425 122 C435 117 442 108 445 98 H415 C410 102 402 105 395 105 C382 105 372 95 372 80 C372 65 382 55 395 55 C402 55 410 58 415 62 H445 C442 52 435 45 430 40"
            fill={textColor}
          />
        </g>
      </svg>
    </div>
  );
};
