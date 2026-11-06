import React from 'react';
import { useApp } from '../../context/AppContext';
import BuyPalLogo from '../../components/BuyPalLogo';
import PhoneMockup from '../../components/PhoneMockup';
import { ShieldCheck, Zap, Users, Sparkles, Check } from 'lucide-react';

export default function PasswordUpdatedSuccessView() {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-4">
          <BuyPalLogo size="lg" className="mb-2" />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Set a New <br />
            Password
          </h2>
          <p className="text-slate-600 text-base max-w-md">
            Create a strong password to keep your BuyPal account secure.
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

        {/* Right Column: Password Updated Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-100 flex flex-col items-center text-center">
            {/* Green Success Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
              Password Updated!
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              Your BuyPal password has been reset successfully. You can now log in with your new password.
            </p>

            {/* Go to Login CTA */}
            <button
              onClick={() => setCurrentView('login')}
              className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition duration-150 mb-4"
            >
              <span>Go to Login</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
