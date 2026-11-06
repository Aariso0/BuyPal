import React from 'react';

export default function BuyPalLogo({ size = 'md', className = '' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const iconSize = isLarge ? 'w-10 h-10' : isSmall ? 'w-7 h-7' : 'w-8 h-8';
  const textSize = isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* BuyPal Dual Gradient Pill Icon */}
      <div className={`relative ${iconSize} flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Cyan/Sky back curve */}
          <path
            d="M8 22C8 14 14 8 22 8L26 8C27.1 8 28 8.9 28 10V14C28 22 22 28 14 28H10C8.9 28 8 27.1 8 26V22Z"
            fill="url(#paint0_linear)"
          />
          {/* Blue front curve */}
          <path
            d="M13 26C13 18.5 18.5 13 26 13L28 13C29.1 13 30 13.9 30 15V18C30 25.5 24.5 31 17 31H15C13.9 31 13 30.1 13 29V26Z"
            fill="url(#paint1_linear)"
          />
          <defs>
            <linearGradient id="paint0_linear" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00D2FF" />
              <stop offset="1" stopColor="#0072FF" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="13" y1="13" x2="30" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0066FF" />
              <stop offset="1" stopColor="#003BCB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={`${textSize} text-[#0F172A] font-extrabold tracking-tight`}>
        Buy<span className="text-[#0066FF]">Pal</span>
      </span>
    </div>
  );
}
