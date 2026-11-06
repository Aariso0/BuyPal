import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BuyPalLogo from '../../components/BuyPalLogo';
import PhoneMockup from '../../components/PhoneMockup';
import { ShieldCheck, Zap, Users, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginView() {
  const { setCurrentView } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('shivashish@buypal.in');
  const [password, setPassword] = useState('••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Branding, Phone & Value Badges */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-4">
          <BuyPalLogo size="lg" className="mb-2" />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome Back to <br />
            <span className="text-slate-900">BuyPal</span>
          </h2>
          <p className="text-slate-600 text-base max-w-md">
            Log in to manage your payments, circles, and AI shopping — all in one place.
          </p>

          <PhoneMockup />

          {/* 4 Feature Badges */}
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

        {/* Right Column: Log In Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Log In to Your Account
              </h3>
              <p className="text-slate-500 text-sm mt-1.5">
                Enter your details to continue to BuyPal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView('forgot-password')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition duration-150"
              >
                <span>Log In</span>
                <span>→</span>
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <span className="relative bg-white px-4 text-xs text-slate-400">
                  or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition shadow-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-sm text-slate-500">
                  Don't have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
