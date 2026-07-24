'use client';

import React from 'react';
import { VisitingCardPreview, VisitingCardData } from './VisitingCardPreview';

interface VisitingCardPrintProps {
  cardData: VisitingCardData;
  sizePreset?: 'ISO' | 'LARGE' | 'US';
}

export const VisitingCardPrint: React.FC<VisitingCardPrintProps> = ({
  cardData,
  sizePreset = 'ISO',
}) => {
  // Physical Dimensions in mm
  // ISO: 85.6mm x 54mm (0.647 scale against 500px x 315px base)
  // US: 88.9mm x 50.8mm (0.672 scale)
  // LARGE: 130mm x 81.9mm (0.983 scale - High visibility A4 presentation)
  let widthMm = '85.6mm';
  let heightMm = '54mm';
  let scaleFactor = 0.64704;

  if (sizePreset === 'US') {
    widthMm = '88.9mm';
    heightMm = '50.8mm';
    scaleFactor = 0.672;
  } else if (sizePreset === 'LARGE') {
    widthMm = '130mm';
    heightMm = '81.9mm';
    scaleFactor = 0.983;
  }

  return (
    <div className="printable-grid-container flex flex-col items-center justify-center gap-[12mm]">
      {/* FRONT SIDE CARD */}
      <div
        style={{
          width: widthMm,
          height: heightMm,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: sizePreset === 'LARGE' ? '4mm' : '2.5mm',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        className="card-print-frame border border-neutral-800/20"
      >
        <div
          style={{
            width: '500px',
            height: '315px',
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left',
          }}
        >
          <VisitingCardPreview cardData={cardData} side="front" scale={1} />
        </div>
      </div>

      {/* BACK SIDE CARD */}
      <div
        style={{
          width: widthMm,
          height: heightMm,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: sizePreset === 'LARGE' ? '4mm' : '2.5mm',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        className="card-print-frame border border-neutral-800/20"
      >
        <div
          style={{
            width: '500px',
            height: '315px',
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left',
          }}
        >
          <VisitingCardPreview cardData={cardData} side="back" scale={1} />
        </div>
      </div>
    </div>
  );
};
