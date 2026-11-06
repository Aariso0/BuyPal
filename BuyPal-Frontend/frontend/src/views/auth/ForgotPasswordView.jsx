import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BuyPalLogo from '../../components/BuyPalLogo';
import PhoneMockup from '../../components/PhoneMockup';
import { ShieldCheck, Zap, Users, Sparkles, Mail } from 'lucide-react';

export default function ForgotPasswordView() {
  const { setCurrentView } = useApp();
  const [identifier, setIdentifier] = useState('shivashish@buypal.in');

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentView('otp');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-4">
          <BuyPalLogo size="lg" className="mb-2" />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Reset Your <br />
            Password
          </h2>
          <p className="text-slate-600 text-base max-w-md">
            No worries! Enter your registered email and we'll send you a reset link.
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

        {/* Right Column: Forgot Password Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Forgot Password?
              </h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Enter your email or mobile number to receive an OTP for password reset.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email Address or Mobile Number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition duration-150"
              >
                <span>Send OTP</span>
                <span>→</span>
              </button>

              <div className="text-center pt-4">
                <span className="text-sm text-slate-500">Back to </span>
                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
