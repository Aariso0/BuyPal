import React from 'react';
import { useApp } from '../context/AppContext';
import BuyPalLogo from '../components/BuyPalLogo';
import {
  CreditCard,
  Users,
  Sparkles,
  Wallet,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShoppingCart,
  Send,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage() {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-800">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <BuyPalLogo size="md" />

        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
          <button className="text-blue-600 hover:text-blue-700">Home</button>
          <div className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
            <span>Features</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <button className="hover:text-slate-900">Pricing</button>
          <button className="hover:text-slate-900">Security</button>
          <button className="hover:text-slate-900">About</button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('login')}
            className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            Log In
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#0066FF] hover:bg-[#0052D4] rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Payments Made Smarter.<br />
              <span className="text-blue-600">Shopping Made Easier.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg font-normal leading-relaxed">
              Meet <strong className="text-slate-900">BuyPal</strong> – the smarter way to manage shared payments, empower your circle, and let AI find the best deals for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-8 py-4 bg-[#0066FF] hover:bg-[#0052D4] text-white font-bold text-base rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/25 transition duration-150"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl shadow-xs transition"
              >
                Explore BuyPal
              </button>
            </div>
          </div>

          {/* Right Hero Graphic Mockups */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Laptop & Mobile Composite Card */}
              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-3xl p-6 border border-blue-100 shadow-xl overflow-hidden">
                {/* Floating Circle Badge */}
                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">My Circle (4)</span>
                </div>

                {/* Dashboard Screen Mockup */}
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 mb-4 transform -rotate-1 hover:rotate-0 transition duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">BuyPal Dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl">
                      <div className="text-[10px] opacity-80">Wallet Balance</div>
                      <div className="text-xs font-bold mt-0.5">₹ 12,480.50</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-500">Circle Limit</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">₹ 15,000</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-500">Monthly Spending</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">₹ 8,500</div>
                    </div>
                  </div>
                </div>

                {/* Floating Phone Approval Card */}
                <div className="absolute right-4 bottom-4 z-20 w-52 bg-white rounded-2xl p-3.5 shadow-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                    <span>Payment Approved</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">₹ 3,499</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Wireless Headphones</div>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full mt-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold"
                  >
                    Buy with BuyPal →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 pt-10 border-t border-slate-200">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Payments for Everyone</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Send, receive, and manage money with ease and confidence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Your Circle, Your Control</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add family or team members with defined spending limits and permissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">AI-Powered Shopping</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Find, compare and get the best deals with your personal AI assistant.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Smart Wallet Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Allocate budgets, track spending, and keep everything in control.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Feature Showcase Sections (01 to 04) */}
        <div className="space-y-12 mt-24">
          {/* 01: Receive Payments */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg">
                01
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Receive Payments
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Get paid instantly from anyone — friends, family, or customers — with just a link or QR.
              </p>
              <button
                onClick={() => setCurrentView('send-receive')}
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <div className="bg-gradient-to-tr from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-slate-100 w-full max-w-sm">
                <div className="bg-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Payment Received</div>
                      <div className="text-lg font-black text-slate-900">₹ 2,500</div>
                      <div className="text-[11px] text-slate-500">from Riya</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* 02: Make Payouts */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg">
                02
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Make Payouts
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Send money to individuals or groups instantly and securely, anytime.
              </p>
              <button
                onClick={() => setCurrentView('send-receive')}
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <div className="bg-gradient-to-tr from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-slate-100 w-full max-w-sm">
                <div className="bg-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Payout Sent</div>
                      <div className="text-lg font-black text-slate-900">₹ 8,000</div>
                      <div className="text-[11px] text-slate-500">to Team Event</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Done</span>
                </div>
              </div>
            </div>
          </div>

          {/* 03: Make Circles */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg">
                03
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Make Circles
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Create a circle with family, friends, or your team, set spending limits, and manage shared payments together.
              </p>
              <button
                onClick={() => setCurrentView('circle')}
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <div className="bg-gradient-to-tr from-purple-50 to-blue-50 rounded-2xl p-6 border border-slate-100 w-full max-w-sm">
                <div className="bg-white rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-800">My Circle</span>
                    </div>
                    <span className="text-xs text-slate-400">4 Members</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">RV</div>
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">AK</div>
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">MS</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">PD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 04: Automate Shopping with AI */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg">
                04
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Automate Shopping with AI
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Let your AI shopping assistant find the best deals, compare prices, and complete purchases with your approval.
              </p>
              <button
                onClick={() => setCurrentView('ai-shopping')}
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <div className="bg-gradient-to-tr from-sky-50 to-indigo-50 rounded-2xl p-6 border border-slate-100 w-full max-w-sm">
                <div className="bg-white rounded-2xl p-5 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Shopping Assistant</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-2 text-center">
                      <div className="text-[9px] font-bold text-blue-600">Best Deal</div>
                      <div className="text-xs font-extrabold text-slate-900 mt-1">₹ 3,499</div>
                      <div className="text-[8px] text-emerald-600 font-bold">42% OFF</div>
                    </div>
                    <div className="border border-slate-100 rounded-xl p-2 text-center">
                      <div className="text-[9px] text-slate-400">Amazon</div>
                      <div className="text-xs font-extrabold text-slate-700 mt-1">₹ 3,999</div>
                    </div>
                    <div className="border border-slate-100 rounded-xl p-2 text-center">
                      <div className="text-[9px] text-slate-400">Flipkart</div>
                      <div className="text-xs font-extrabold text-slate-700 mt-1">₹ 4,199</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center justify-center pt-16 text-slate-400">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4" />
          </div>
          <span className="text-xs mt-2 font-medium">Scroll to explore</span>
        </div>
      </section>
    </div>
  );
}
