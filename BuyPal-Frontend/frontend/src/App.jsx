import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';

// Views
import LandingPage from './views/LandingPage';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import ForgotPasswordView from './views/auth/ForgotPasswordView';
import OtpVerificationView from './views/auth/OtpVerificationView';
import ResetPasswordView from './views/auth/ResetPasswordView';
import PasswordUpdatedSuccessView from './views/auth/PasswordUpdatedSuccessView';

import DashboardView from './views/DashboardView';
import MyWalletView from './views/MyWalletView';
import SendReceiveView from './views/SendReceiveView';
import MyCircleView from './views/MyCircleView';
import AIShoppingView from './views/AIShoppingView';
import ProductComparisonView from './views/ProductComparisonView';
import TransactionsView from './views/TransactionsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export default function App() {
  const { currentView, setCurrentView } = useApp();
  const [showDemoNav, setShowDemoNav] = useState(false);

  // Screen catalog
  const screenList = [
    { id: 'landing', label: '1. Landing Page', group: 'Public' },
    { id: 'register', label: '2. Register / Sign Up', group: 'Auth' },
    { id: 'login', label: '3. Log In', group: 'Auth' },
    { id: 'forgot-password', label: '4. Forgot Password', group: 'Auth' },
    { id: 'otp', label: '5. Verify OTP', group: 'Auth' },
    { id: 'reset-password', label: '6. Set New Password', group: 'Auth' },
    { id: 'password-success', label: '7. Password Reset Success', group: 'Auth' },
    { id: 'dashboard', label: '8. Dashboard Hub', group: 'App' },
    { id: 'wallet', label: '9. My Wallet', group: 'App' },
    { id: 'send-receive', label: '10. Send & Receive', group: 'App' },
    { id: 'circle', label: '11. My Circle (Shared)', group: 'App' },
    { id: 'ai-shopping', label: '12. AI Shopping Hub', group: 'App' },
    { id: 'product-detail', label: '13. Lenovo LOQ Comparison', group: 'App' },
    { id: 'transactions', label: '14. Transactions & Drawer', group: 'App' },
    { id: 'analytics', label: '15. Analytics & Charts', group: 'App' },
    { id: 'settings', label: '16. Account Settings', group: 'App' },
  ];

  const isAuthView = [
    'login',
    'register',
    'forgot-password',
    'otp',
    'reset-password',
    'password-success'
  ].includes(currentView);

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'otp':
        return <OtpVerificationView />;
      case 'reset-password':
        return <ResetPasswordView />;
      case 'password-success':
        return <PasswordUpdatedSuccessView />;
      case 'dashboard':
        return <DashboardView />;
      case 'wallet':
        return <MyWalletView />;
      case 'send-receive':
        return <SendReceiveView />;
      case 'circle':
        return <MyCircleView />;
      case 'ai-shopping':
        return <AIShoppingView />;
      case 'product-detail':
        return <ProductComparisonView />;
      case 'transactions':
        return <TransactionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] relative text-slate-800">
      {/* If Landing or Auth, render full screen without dashboard sidebar */}
      {currentView === 'landing' || isAuthView ? (
        renderContent()
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0">
            {renderContent()}
          </main>
        </div>
      )}

      {/* Interactive Floating Quick Navigator for all 16 Prototype Screens */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {showDemoNav && (
            <div className="absolute bottom-12 right-0 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-200 text-xs max-h-96 overflow-y-auto mb-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Prototype Screen Navigator</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">16 Screens</span>
              </div>

              <div className="pt-2 space-y-1">
                {screenList.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      setCurrentView(screen.id);
                      setShowDemoNav(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium transition flex items-center justify-between ${
                      currentView === screen.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{screen.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                      currentView === screen.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {screen.group}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDemoNav(!showDemoNav)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-xl text-xs font-bold transition hover:scale-105"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Switch Screen</span>
            {showDemoNav ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
