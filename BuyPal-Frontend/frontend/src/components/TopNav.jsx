import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function TopNav({ title, subtitle }) {
  const { user, pendingApprovals, setCurrentView } = useApp();

  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      {/* Title & Subtitle */}
      <div>
        {title && (
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-[13px] text-slate-500 mt-0.5 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Universal Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, payments or people..."
            className="w-full bg-white border border-[#E4E9F2] rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setCurrentView('circle')}
          title="Notifications & Approvals"
          className="relative w-10 h-10 rounded-full bg-white border border-[#E4E9F2] flex items-center justify-center text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Bell className="w-4 h-4" />
          {pendingApprovals.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Pill */}
        <div
          onClick={() => setCurrentView('settings')}
          className="flex items-center gap-2 bg-white border border-[#E4E9F2] rounded-full p-1 pr-3 cursor-pointer hover:bg-slate-50 transition shadow-xs select-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs tracking-wider">
            {user.avatarText}
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
