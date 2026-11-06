import React from 'react';
import { useApp } from '../context/AppContext';
import BuyPalLogo from './BuyPalLogo';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Users,
  Sparkles,
  Clock,
  BarChart3,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'send-receive', label: 'Send & Receive', icon: ArrowLeftRight },
    { id: 'circle', label: 'My Circle', icon: Users },
    { id: 'ai-shopping', label: 'AI Shopping', icon: Sparkles },
    { id: 'transactions', label: 'Transactions', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E8EDF5] min-h-screen flex flex-col p-5 shrink-0 select-none">
      {/* Brand Header */}
      <div className="px-3 py-2 mb-8 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
        <BuyPalLogo size="md" />
      </div>

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Active if currentView matches, or if in product-detail treat ai-shopping as active
          const isActive = currentView === item.id || (item.id === 'ai-shopping' && currentView === 'product-detail');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all ${
                isActive
                  ? 'bg-[#EAEFF7] text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900 stroke-[2.2]' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick View Switcher for Developer / Presentation purposes */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setCurrentView('landing')}
          className="w-full text-xs text-blue-600 hover:underline text-left px-2 py-1 flex items-center justify-between"
        >
          <span>← Back to Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
