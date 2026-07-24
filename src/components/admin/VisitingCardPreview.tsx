'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, MessageSquare, ExternalLink, QrCode } from 'lucide-react';

export interface VisitingCardData {
  fullName: string;
  designation?: string;
  department?: string;
  employeeCode?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  extension?: string;
  profilePhoto?: string;
  companyName?: string;
  companyLogo?: string;
  website?: string;
  address?: string;
  qrCodeType?: string; // VCARD | WEBSITE | WHATSAPP | EMAIL | CUSTOM
  qrCodeValue?: string;
  customQrUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  templateType?: string; // CLASSIC | MODERN | CORPORATE | MINIMAL | DARK | PREMIUM | VERTICAL | HORIZONTAL
  iconStyle?: string; // circle | square | minimalist
  frontBgType?: string; // POLYGON | GRADIENT | SOLID
  backBgType?: string; // LIGHT_POLYGON | SOLID | DARK_POLYGON
}

interface VisitingCardPreviewProps {
  cardData: VisitingCardData;
  side?: 'front' | 'back';
  scale?: number;
  showFlipButton?: boolean;
  onFlip?: () => void;
  className?: string;
}

// ─── SVG Low-Poly Geometric Texture Backgrounds ──────────────────────────────
function DarkLowPolySvg({ primaryColor = '#D72626' }: { primaryColor?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      viewBox="0 0 500 286"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="0,0 120,0 60,90" fill="rgba(255, 255, 255, 0.025)" />
      <polygon points="120,0 260,0 180,100" fill="rgba(255, 255, 255, 0.015)" />
      <polygon points="260,0 400,0 310,110" fill="rgba(255, 255, 255, 0.02)" />
      <polygon points="400,0 500,0 460,80" fill="rgba(255, 255, 255, 0.01)" />

      <polygon points="0,0 60,90 0,160" fill="rgba(255, 255, 255, 0.02)" />
      <polygon points="60,90 180,100 110,190" fill="rgba(255, 255, 255, 0.03)" />
      <polygon points="180,100 310,110 240,210" fill="rgba(255, 255, 255, 0.02)" />
      <polygon points="310,110 460,80 390,200" fill="rgba(255, 255, 255, 0.025)" />
      <polygon points="460,80 500,0 500,120" fill="rgba(255, 255, 255, 0.015)" />

      <polygon points="0,160 110,190 0,286" fill="rgba(255, 255, 255, 0.02)" />
      <polygon points="110,190 240,210 160,286" fill="rgba(255, 255, 255, 0.01)" />
      <polygon points="240,210 390,200 320,286" fill="rgba(255, 255, 255, 0.02)" />
      <polygon points="390,200 500,120 500,286" fill="rgba(255, 255, 255, 0.015)" />
      <polygon points="320,286 500,286 390,200" fill="rgba(215, 38, 38, 0.15)" />
    </svg>
  );
}

function LightLowPolySvg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25"
      viewBox="0 0 500 286"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="0,0 140,0 70,80" fill="#000000" opacity="0.04" />
      <polygon points="140,0 290,0 210,95" fill="#000000" opacity="0.02" />
      <polygon points="290,0 420,0 350,85" fill="#000000" opacity="0.05" />
      <polygon points="420,0 500,0 470,70" fill="#000000" opacity="0.03" />

      <polygon points="0,0 70,80 0,150" fill="#000000" opacity="0.03" />
      <polygon points="70,80 210,95 130,180" fill="#000000" opacity="0.06" />
      <polygon points="210,95 350,85 270,195" fill="#000000" opacity="0.04" />
      <polygon points="350,85 470,70 410,185" fill="#000000" opacity="0.05" />
      <polygon points="470,70 500,0 500,130" fill="#000000" opacity="0.02" />

      <polygon points="0,150 130,180 0,286" fill="#000000" opacity="0.04" />
      <polygon points="130,180 270,195 190,286" fill="#000000" opacity="0.02" />
      <polygon points="270,195 410,185 330,286" fill="#000000" opacity="0.05" />
      <polygon points="410,185 500,130 500,286" fill="#000000" opacity="0.03" />
    </svg>
  );
}

// ─── Inline QR Code Generator Component ───────────────────────────────────────
function QrCodeSvg({ text, size = 64 }: { text: string; size?: number }) {
  // Simple deterministic 2D grid matrix QR visualization representation
  const modules = React.useMemo(() => {
    const grid: boolean[][] = [];
    const matrixSize = 21;
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < matrixSize; c++) {
        // Position detection patterns (corners)
        const isTL = r < 7 && c < 7;
        const isTR = r < 7 && c >= matrixSize - 7;
        const isBL = r >= matrixSize - 7 && c < 7;

        if (isTL || isTR || isBL) {
          const border =
            (r === 0 || r === 6 || c === 0 || c === 6) && (isTL || isTR);
          const borderBL =
            (r === matrixSize - 7 || r === matrixSize - 1 || c === 0 || c === 6) && isBL;
          const innerTL = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          const innerTR = r >= 2 && r <= 4 && c >= matrixSize - 5 && c <= matrixSize - 3;
          const innerBL = r >= matrixSize - 5 && r <= matrixSize - 3 && c >= 2 && c <= 4;

          row.push(border || borderBL || innerTL || innerTR || innerBL);
        } else {
          // Pseudorandom grid module pattern based on string hash
          const val = (Math.abs(hash ^ (r * 31 + c * 17)) % 100) > 45;
          row.push(val);
        }
      }
      grid.push(row);
    }
    return grid;
  }, [text]);

  const moduleSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-white p-1 rounded-md shadow-sm">
      {modules.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * moduleSize}
              y={r * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#000000"
            />
          ) : null
        )
      )}
    </svg>
  );
}

interface VisitingCardPreviewProps {
  cardData: VisitingCardData;
  side?: 'front' | 'back';
  scale?: number;
  usePhysicalUnits?: boolean;
  showFlipButton?: boolean;
  onFlip?: () => void;
  className?: string;
}

export const VisitingCardPreview: React.FC<VisitingCardPreviewProps> = ({
  cardData,
  side = 'front',
  scale = 1,
  usePhysicalUnits = false,
  showFlipButton = false,
  onFlip,
  className = '',
}) => {
  const {
    fullName = 'Moazam Muzzamil',
    designation = 'Managing Director',
    department = 'Executive Management',
    phone = '+92 302 55555',
    whatsapp = '+92 302 55555',
    email = 'info@rebonmotorcompany.com',
    website = 'www.rebonmotorcompany.com',
    address = '88-D/1, Main Boulevard, Gulberg III, Lahore',
    companyName = 'REBON MOTOR COMPANY',
    companyLogo,
    profilePhoto,
    primaryColor = '#D72626',
    secondaryColor = '#1E1E1E',
    backgroundColor = '#0F0F11',
    textColor = '#FFFFFF',
    fontFamily = 'Inter',
    borderRadius = '16px',
    templateType = 'MODERN',
    iconStyle = 'circle',
    qrCodeType = 'VCARD',
    qrCodeValue,
    customQrUrl,
  } = cardData;

  // Construct QR Payload
  const getQrPayload = () => {
    if (qrCodeType === 'WEBSITE') return website.startsWith('http') ? website : `https://${website}`;
    if (qrCodeType === 'WHATSAPP') return `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
    if (qrCodeType === 'EMAIL') return `mailto:${email}`;
    if (qrCodeType === 'CUSTOM') return customQrUrl || website;
    return `BEGIN:VCARD\nVERSION:3.0\nN:${fullName.split(' ').slice(1).join(' ')};${fullName.split(' ')[0]};;;\nFN:${fullName}\nORG:${companyName}\nTITLE:${designation}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nURL:${website}\nADR:;;${address};;;;\nEND:VCARD`;
  };

  const isVertical = templateType === 'VERTICAL';
  const isMinimal = templateType === 'MINIMAL';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Real Business Card Aspect Ratio Container (ISO 85.6mm x 54mm / 500px x 315px) */}
      <div
        style={{
          width: usePhysicalUnits ? (isVertical ? '54mm' : '85.6mm') : (isVertical ? '315px' : '500px'),
          height: usePhysicalUnits ? (isVertical ? '85.6mm' : '54mm') : (isVertical ? '500px' : '315px'),
          transform: usePhysicalUnits ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          borderRadius: usePhysicalUnits ? '2.5mm' : borderRadius,
          fontFamily,
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        className="relative overflow-hidden shadow-2xl transition-all duration-300 border border-neutral-800/20"
      >
        {/* ─── FRONT SIDE ───────────────────────────────────────────────────── */}
        {side === 'front' && (
          <div
            style={{
              backgroundColor: isMinimal ? '#FFFFFF' : backgroundColor,
              color: isMinimal ? '#1E1E1E' : textColor,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
            className="w-full h-full relative p-6 flex flex-col justify-between overflow-hidden"
          >
            {/* Low poly background texture */}
            {!isMinimal && <DarkLowPolySvg primaryColor={primaryColor} />}

            {/* Accent color bar */}
            <div
              style={{ backgroundColor: primaryColor }}
              className="absolute top-0 left-0 w-full h-1.5 z-10"
            />

            {/* Top Bar: Profile photo / Employee code if present */}
            <div className="relative z-10 flex items-center justify-between">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: primaryColor }}
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
                    {companyName}
                  </span>
                </div>
              )}

              {/* QR Code display */}
              <div className="flex items-center gap-2">
                <QrCodeSvg text={getQrPayload()} size={isVertical ? 48 : 52} />
              </div>
            </div>

            {/* Middle Content: Employee Name & Designation */}
            <div className="relative z-10 pr-2 mt-2 mb-3">
              <h2 className="text-xl font-black font-display tracking-tight text-white leading-none uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                {fullName}
              </h2>
              {designation && (
                <p
                  style={{ color: primaryColor }}
                  className="text-[10px] font-bold uppercase tracking-wider mt-1.5 mb-3"
                >
                  {designation}
                  {department && <span className="text-neutral-400 font-normal"> — {department}</span>}
                </p>
              )}
            </div>

            {/* Bottom/Right Info Pills (Matching Exact Sample Layout!) */}
            <div className="relative z-10 space-y-2 text-[11px] font-medium tracking-wide">
              {email && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md flex-shrink-0">
                    <Mail size={12} />
                  </div>
                  <span className="truncate text-neutral-200">{email}</span>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md flex-shrink-0">
                    <Phone size={12} />
                  </div>
                  <span className="text-neutral-200">{phone}</span>
                </div>
              )}

              {address && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md flex-shrink-0">
                    <MapPin size={12} />
                  </div>
                  <span className="truncate text-neutral-200 max-w-[280px]">{address}</span>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md flex-shrink-0">
                    <Globe size={12} />
                  </div>
                  <span className="truncate text-neutral-200">{website}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── BACK SIDE ────────────────────────────────────────────────────── */}
        {side === 'back' && (
          <div className="w-full h-full relative p-6 bg-[#F6F6F8] text-neutral-900 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Light low poly texture */}
            <LightLowPolySvg />

            {/* Accent line top */}
            <div
              style={{ backgroundColor: primaryColor }}
              className="absolute top-0 left-0 w-full h-1.5 z-10"
            />

            {/* Back Side Branding: Logo & Company Name */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="h-14 w-auto max-w-[240px] object-contain" />
              ) : (
                <div className="flex flex-col items-center">
                  {/* Styled RMC Scooter Emblem */}
                  <div className="flex items-center justify-center text-3xl font-black font-display tracking-tighter text-neutral-950">
                    <span className="text-[#D72626]">R</span>MC
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-700 mt-1">
                    {companyName}
                  </div>
                </div>
              )}

              <div className="w-12 h-0.5 bg-[#D72626] rounded-full my-2" />
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-500">
                Engineering the Future of Mobility
              </p>
              <p className="text-[9px] text-neutral-400 font-medium">
                {website}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Flip Button overlay */}
      {showFlipButton && onFlip && (
        <button
          onClick={onFlip}
          className="mt-4 px-4 py-1.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>Flip to {side === 'front' ? 'Back' : 'Front'} Side</span>
        </button>
      )}
    </div>
  );
};
