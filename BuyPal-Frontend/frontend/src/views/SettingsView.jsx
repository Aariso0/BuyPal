import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  User,
  Shield,
  CreditCard,
  Users,
  Bell,
  Sparkles,
  Moon,
  Globe,
  HelpCircle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Trash2,
  Calendar,
  Languages,
  Check
} from 'lucide-react';

export default function SettingsView() {
  const { user, setUser } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const subTabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'circle', label: 'My Circle', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI & Shopping', icon: Sparkles },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(user.handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveProfile = () => {
    setUser({ ...user, name });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="Settings"
        subtitle="Manage your account, security, payments, and preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Submenu */}
        <div className="lg:col-span-3 space-y-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#EAEFF7] text-slate-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your profile and account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {user.avatarText}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-xs cursor-pointer hover:bg-slate-50">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5">
                  ✓ Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {isEditing && (
            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex-1"
              />
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          )}

          {/* Account Details 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Full Name</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{user.name}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Email Address</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{user.email}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Phone Number</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{user.phone}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">BuyPal ID</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{user.handle}</div>
              </div>
              <button onClick={handleCopyId} className="text-slate-400 hover:text-slate-600">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Account Preferences */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Account Preferences
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Currency</div>
                    <div className="text-xs font-bold text-slate-900">{user.currency}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Time Zone</div>
                    <div className="text-xs font-bold text-slate-900">{user.timeZone}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Language</div>
                    <div className="text-xs font-bold text-slate-900">{user.language}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Account Actions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E8EDF5] shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Download Your Data</div>
                    <div className="text-[10px] text-slate-400">Get a copy of your BuyPal data.</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-xs flex items-center justify-between cursor-pointer hover:bg-red-50/40 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-600">Delete Account</div>
                    <div className="text-[10px] text-slate-400">Permanently delete your BuyPal account.</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
