import React from 'react';

export default function PhoneMockup() {
  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Device Body */}
      <div className="relative w-[210px] h-[390px] bg-slate-950 rounded-[44px] p-2.5 shadow-2xl border-[3.5px] border-slate-700/80 ring-1 ring-slate-900/10">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-end px-2">
          <div className="w-2 h-2 rounded-full bg-[#1e293b]"></div>
        </div>

        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[36px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute w-40 h-40 bg-blue-100/60 rounded-full blur-2xl pointer-events-none"></div>

          {/* Centered BuyPal Brand Symbol */}
          <div className="w-20 h-20 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <path
                d="M25 60C25 40 40 25 60 25H70C73 25 75 27 75 30V40C75 60 60 75 40 75H30C27 75 25 73 25 70V60Z"
                fill="url(#phone_g1)"
              />
              <path
                d="M38 72C38 52 52 38 72 38H80C83 38 85 40 85 43V50C85 70 70 85 50 85H43C40 85 38 83 38 80V72Z"
                fill="url(#phone_g2)"
              />
              <defs>
                <linearGradient id="phone_g1" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00E5FF" />
                  <stop offset="1" stopColor="#0066FF" />
                </linearGradient>
                <linearGradient id="phone_g2" x1="38" y1="38" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0066FF" />
                  <stop offset="1" stopColor="#002CB8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Shadow underneath */}
      <div className="w-48 h-5 bg-slate-400/20 rounded-full blur-md mt-4"></div>
    </div>
  );
}
