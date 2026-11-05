import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BuyPalLogo from '../../components/BuyPalLogo';
import PhoneMockup from '../../components/PhoneMockup';
import { ShieldCheck, Zap, Users, Sparkles, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function ResetPasswordView() {
  const { setCurrentView } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Requirements checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentView('password-success');
  };

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

        {/* Right Column: Reset Password Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-100 flex flex-col items-center">
            {/* Padlock Illustration */}
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-400/30">
                <Lock className="w-8 h-8 text-white stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest shadow">
                ****
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Reset Your Password
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Enter a new password for your BuyPal account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* New Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="pt-2 pb-2">
                <span className="block text-xs font-bold text-slate-800 mb-2">Password Requirements:</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 font-medium' : ''}`}>
                    <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 font-medium' : ''}`}>
                    <Check className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>One uppercase letter (A–Z)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasLowercase ? 'text-emerald-600 font-medium' : ''}`}>
                    <Check className={`w-3.5 h-3.5 ${hasLowercase ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>One lowercase letter (a–z)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 font-medium' : ''}`}>
                    <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>One number (0–9)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-600 font-medium' : ''}`}>
                    <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>One special character (e.g., ! @ # $ %)</span>
                  </li>
                </ul>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition duration-150"
              >
                <span>Update Password</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
