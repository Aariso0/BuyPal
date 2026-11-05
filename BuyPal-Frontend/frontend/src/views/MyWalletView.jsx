import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Sliders,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  ArrowDownToLine,
  Info
} from 'lucide-react';

export default function MyWalletView() {
  const {
    walletBalance,
    showBalance,
    setShowBalance,
    addWalletMoney,
    monthlyLimit,
    monthlySpent
  } = useApp();

  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [successToast, setSuccessToast] = useState(false);

  const presets = [500, 1000, 2000, 5000];

  const handleTopUp = () => {
    if (topUpAmount > 0) {
      addWalletMoney(topUpAmount);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2500);
    }
  };

  const percentageUsed = Math.min(100, Math.round((monthlySpent / monthlyLimit) * 100));

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="My Wallet"
        subtitle="Manage your balance, payment methods and wallet activity."
      />

      {/* Row 1: Wallet Balance + Linked Payment Methods + Wallet Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Wallet Balance Card */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#5D4EF5] via-[#7557F8] to-[#915BFF] text-white rounded-3xl p-6 shadow-card overflow-hidden flex flex-col justify-between min-h-[190px]">
          <div className="absolute right-4 bottom-2 text-white/10 font-black text-8xl pointer-events-none select-none">
            B
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wide text-white/80">
                Wallet Balance
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

          <div className="flex items-center gap-3 pt-4 z-10">
            <button
              onClick={() => handleTopUp()}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Money</span>
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl font-bold text-xs transition">
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Linked Payment Methods */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Linked Payment Methods</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {/* PayPal */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                  P
                </div>
                <span className="text-xs font-bold text-slate-800">PayPal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Primary</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* HDFC Bank */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">
                  H
                </div>
                <span className="text-xs font-bold text-slate-800">HDFC Bank ****4287</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* UPI */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[9px]">
                  UPI
                </div>
                <span className="text-xs font-bold text-slate-800">UPI ID: shivashish@pay</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <button className="w-full mt-2 py-2 border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <Plus className="w-3.5 h-3.5" />
            <span>Link New Payment Method</span>
          </button>
        </div>

        {/* Wallet Actions */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Wallet Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
              <Plus className="w-5 h-5 text-slate-700 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Add Money</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
              <CreditCard className="w-5 h-5 text-slate-700 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Withdraw</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
              <RefreshCw className="w-5 h-5 text-slate-700 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Set Auto-Add</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
              <Sliders className="w-5 h-5 text-slate-700 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Wallet Limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Wallet Overview + Monthly Limit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Wallet Overview 4-Pill Row */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Wallet Overview</h3>
            <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              This Month ▾
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Added */}
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3 flex flex-col items-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <ArrowDownToLine className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-slate-900">₹ 15,000.00</div>
              <div className="text-[10px] text-slate-500">Money Added</div>
            </div>

            {/* Spent */}
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3 flex flex-col items-start">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-slate-900">₹ 6,580.00</div>
              <div className="text-[10px] text-slate-500">Money Spent</div>
            </div>

            {/* Sent */}
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3 flex flex-col items-start">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <Send className="w-3.5 h-3.5 -rotate-12" />
              </div>
              <div className="text-xs font-black text-slate-900">₹ 3,200.00</div>
              <div className="text-[10px] text-slate-500">Money Sent</div>
            </div>

            {/* Received */}
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3 flex flex-col items-start">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-slate-900">₹ 1,500.00</div>
              <div className="text-[10px] text-slate-500">Money Received</div>
            </div>
          </div>
        </div>

        {/* Monthly Limit Bar */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Monthly Limit</h3>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-black text-slate-900">
              ₹ {monthlyLimit.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Progress bar */}
          <div className="py-2">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percentageUsed}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">₹ {monthlySpent.toLocaleString('en-IN')} used</span>
            <span className="text-slate-500">₹ {(monthlyLimit - monthlySpent).toLocaleString('en-IN')} remaining</span>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity + Quick Top-Up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Wallet Activity */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Wallet Activity</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <ArrowDownToLine className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Added to Wallet</div>
                  <div className="text-[11px] text-slate-400">via HDFC Bank ****4287</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600">+ ₹ 5,000.00</div>
                <div className="text-[10px] text-slate-400">Today, 5:14 PM</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-100">
                  🛒
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Payment at Amazon</div>
                  <div className="text-[11px] text-slate-400">Wallet Payment</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-500">- ₹ 3,299.00</div>
                <div className="text-[10px] text-slate-400">Today, 7:42 PM</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Send className="w-4 h-4 -rotate-12" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sent to Rahul Verma</div>
                  <div className="text-[11px] text-slate-400">UPI Transfer</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-500">- ₹ 1,200.00</div>
                <div className="text-[10px] text-slate-400">Yesterday, 9:18 PM</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Received from Family Circle</div>
                  <div className="text-[11px] text-slate-400">Shared Expense</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600">+ ₹ 1,500.00</div>
                <div className="text-[10px] text-slate-400">Yesterday, 2:18 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Top-Up */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-4">Quick Top-Up</h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {presets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                    topUpAmount === amt
                      ? 'border-2 border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ₹ {amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleTopUp}
              className="w-full py-3.5 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <span>Add Money to Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {successToast && (
              <p className="text-center text-xs font-bold text-emerald-600 mt-2">
                ✓ Successfully added ₹ {topUpAmount.toLocaleString('en-IN')} to Wallet!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
