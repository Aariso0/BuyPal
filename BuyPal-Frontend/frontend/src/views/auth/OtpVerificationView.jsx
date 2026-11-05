import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import BuyPalLogo from '../../components/BuyPalLogo';
import PhoneMockup from '../../components/PhoneMockup';
import { ShieldCheck, Zap, Users, Sparkles, Send } from 'lucide-react';

export default function OtpVerificationView() {
  const { setCurrentView } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleChange = (val, idx) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);

      // Focus next input automatically
      if (val && idx < 5) {
        const nextInput = document.getElementById(`otp-input-${idx + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-input-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentView('reset-password');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-4">
          <BuyPalLogo size="lg" className="mb-2" />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Verify Your <br />
            OTP
          </h2>
          <p className="text-slate-600 text-base max-w-md">
            Enter the 6-digit OTP sent to your email or mobile number.
          </p>

          <PhoneMockup />

          <div className="grid grid-cols-4 gap-4 w-full pt-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Secure<br />& Encrypted</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Instant<br />Access</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Your<br />Circles</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">AI Shopping<br />Assistant</span>
            </div>
          </div>
        </div>

        {/* Right Column: OTP Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-100 flex flex-col items-center">
            {/* Blue Paper Airplane Badge */}
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Send className="w-8 h-8 -rotate-12 translate-x-0.5" />
            </div>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Verify OTP
              </h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Enter the 6-digit OTP sent to your email or mobile number.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* 6 Digit Boxes */}
              <div className="flex justify-between gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-xs"
                  />
                ))}
              </div>

              {/* Countdown / Resend */}
              <div className="text-center text-sm text-slate-500">
                Didn't receive the OTP?{' '}
                <span className="text-blue-600 font-semibold cursor-pointer">
                  Resend OTP in 00:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition duration-150"
              >
                <span>Verify OTP</span>
                <span>→</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('forgot-password')}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  Back to Forgot Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
