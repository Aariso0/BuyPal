import React from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  Send,
  ArrowDownToLine,
  QrCode,
  ShoppingBag,
  ArrowRight,
  Tag,
  Users,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function DashboardView() {
  const {
    user,
    walletBalance,
    showBalance,
    setShowBalance,
    setCurrentView,
    pendingApprovals
  } = useApp();

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      {/* Top Header */}
      <TopNav
        title={`Welcome Back, ${user.name.split(' ')[0]}`}
        subtitle="Manage your payments, circles, and AI shopping in one place."
      />

      {/* Row 1: Wallet Balance + Quick Actions + My Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Wallet Balance Card (Purple Gradient) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#5D4EF5] via-[#7557F8] to-[#915BFF] text-white rounded-3xl p-6 shadow-card overflow-hidden flex flex-col justify-between min-h-[190px]">
          {/* Subtle BuyPal B watermark */}
          <div className="absolute right-4 bottom-2 text-white/10 font-black text-8xl pointer-events-none select-none">
            B
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wide text-white/80">
                Your Wallet Balance
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-3xl font-black tracking-tight">
              {showBalance ? `₹ ${walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '••••••••'}
            </div>
            <p className="text-xs text-white/70 mt-1">Available to Pay, Send or Shop</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 z-10">
            <button
              onClick={() => setCurrentView('wallet')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Money</span>
            </button>
            <button
              onClick={() => setCurrentView('wallet')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl font-bold text-xs transition"
            >
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setCurrentView('send-receive')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group"
            >
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-blue-600 group-hover:scale-105 transition shadow-2xs">
                <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Send<br />Money</span>
            </button>

            <button
              onClick={() => setCurrentView('send-receive')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group"
            >
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-blue-600 group-hover:scale-105 transition shadow-2xs">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Receive<br />Money</span>
            </button>

            <button
              onClick={() => setCurrentView('send-receive')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group"
            >
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-blue-600 group-hover:scale-105 transition shadow-2xs">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Scan &<br />Pay</span>
            </button>

            <button
              onClick={() => setCurrentView('ai-shopping')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group"
            >
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-blue-600 group-hover:scale-105 transition shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Pay for<br />Shopping</span>
            </button>
          </div>
        </div>

        {/* My Circle Card */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">My Circle</h3>
            <button
              onClick={() => setCurrentView('circle')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#F6F8FC] rounded-2xl p-3 border border-slate-100 mt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Family Circle</div>
                <div className="text-[11px] text-slate-500">4 Members • Shared Payments</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">RV</div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">AK</div>
              <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">MS</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">PD</div>
              <button
                onClick={() => setCurrentView('circle')}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Smart Deals Banner + Circle Payments Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Smart Deals Banner */}
        <div
          onClick={() => setCurrentView('ai-shopping')}
          className="bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#F3E8FF] rounded-3xl p-5 flex items-center justify-between cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9333EA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
              <Tag className="w-6 h-6 rotate-90" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Smart Deals</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Get AI-powered product recommendations and best offers.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-600 group-hover:translate-x-1 transition shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Circle Payments Banner */}
        <div
          onClick={() => setCurrentView('circle')}
          className="bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#DCFCE7] rounded-3xl p-5 flex items-center justify-between cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Circle Payments</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage shared expenses with family, friends, or your team.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:translate-x-1 transition shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions + Spending Insight + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Transactions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
            <button
              onClick={() => setCurrentView('transactions')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Tx 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 font-black text-sm flex items-center justify-center border border-amber-100">
                  a
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Amazon</div>
                  <div className="text-[11px] text-slate-400">Shopping Payment</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-500">- ₹ 3,299.00</div>
                <div className="text-[10px] text-slate-400">Today, 7:42 PM</div>
              </div>
            </div>

            {/* Tx 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">From Family Circle</div>
                  <div className="text-[11px] text-slate-400">Shared Expense (Groceries)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600">+ ₹ 1,500.00</div>
                <div className="text-[10px] text-slate-400">Today, 2:18 PM</div>
              </div>
            </div>

            {/* Tx 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 font-black text-sm flex items-center justify-center border border-red-100">
                  N
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Netflix</div>
                  <div className="text-[11px] text-slate-400">Subscription</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-500">- ₹ 649.00</div>
                <div className="text-[10px] text-slate-400">Yesterday, 9:05 PM</div>
              </div>
            </div>

            {/* Tx 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <svg className="w-4 h-4 fill-emerald-600" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.3 0 .58.09.81.25l13.5 9.5c.67.47.78 1.41.25 2.01-.07.08-.15.15-.24.21l-13.5 9.5c-.23.16-.51.25-.82.25-.83 0-1.5-.67-1.5-1.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Google Play</div>
                  <div className="text-[11px] text-slate-400">App Purchase</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-500">- ₹ 299.00</div>
                <div className="text-[10px] text-slate-400">Yesterday, 5:27 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Insight (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 text-sm">Spending Insight</h3>
            <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              This Month ▾
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 py-3">
            {/* Donut SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Shopping: 48% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0066FF" strokeWidth="4.5" strokeDasharray="48 100" strokeDashoffset="0" />
                {/* Subscriptions: 18% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#00C2FF" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-48" />
                {/* Food & Dining: 14% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#9333EA" strokeWidth="4.5" strokeDasharray="14 100" strokeDashoffset="-66" />
                {/* Others: 20% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E9D5FF" strokeWidth="4.5" strokeDasharray="20 100" strokeDashoffset="-80" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-black text-slate-900">₹ 8,420</span>
                <span className="text-[10px] text-slate-400">Total Spend</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></div>
                  <span className="text-slate-600">Shopping</span>
                </div>
                <span className="font-bold text-slate-800">48%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00C2FF]"></div>
                  <span className="text-slate-600">Subscriptions</span>
                </div>
                <span className="font-bold text-slate-800">18%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></div>
                  <span className="text-slate-600">Food & Dining</span>
                </div>
                <span className="font-bold text-slate-800">14%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E9D5FF]"></div>
                  <span className="text-slate-600">Others</span>
                </div>
                <span className="font-bold text-slate-800">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Links</h3>

          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('ai-shopping')}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Shop with AI</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentView('circle')}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Manage Circle</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentView('circle')}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Payment Approvals</span>
              </div>
              <div className="flex items-center gap-1.5">
                {pendingApprovals.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Security & Limits</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
