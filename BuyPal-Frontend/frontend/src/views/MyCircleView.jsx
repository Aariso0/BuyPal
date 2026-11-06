import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Users,
  Plus,
  ArrowRight,
  UserPlus,
  Receipt,
  ArrowDownLeft,
  Sliders,
  Wallet,
  MoreHorizontal,
  Check,
  X,
  ShoppingCart,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function MyCircleView() {
  const {
    circleMembers,
    setCircleMembers,
    circleBalance,
    setCircleBalance,
    pendingApprovals,
    handleApprove,
    handleReject
  } = useApp();

  const [activeCircleTab, setActiveCircleTab] = useState('members');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberLimit, setNewMemberLimit] = useState('5000');

  const addMember = (e) => {
    e.preventDefault();
    if (newMemberName) {
      const initials = newMemberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      setCircleMembers([
        ...circleMembers,
        {
          id: Date.now(),
          name: newMemberName,
          role: 'Member',
          limit: Number(newMemberLimit),
          initial: initials || 'MB',
          color: 'bg-teal-100 text-teal-700'
        }
      ]);
      setNewMemberName('');
      setShowAddMemberModal(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="My Circle"
        subtitle="Manage your family, friends, or team circle for shared payments and expenses."
      />

      {/* Row 1: Hero Banner + Circle Actions + Circle Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Family Circle Banner */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#5D4EF5] via-[#7557F8] to-[#915BFF] text-white rounded-3xl p-6 shadow-card flex flex-col justify-between min-h-[180px] overflow-hidden">
          {/* Silhouettes in background */}
          <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none">
            <Users className="w-32 h-32" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">Family Circle</h3>
                <p className="text-xs text-white/80">4 Members • Shared Payments</p>
              </div>
            </div>
          </div>

          <div className="z-10 pt-4">
            <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5">
              <span>Manage Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Circle Actions */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Circle Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group"
            >
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-slate-800 group-hover:scale-105 transition">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Add<br />Member</span>
            </button>

            <button className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group">
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-slate-800 group-hover:scale-105 transition">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Share<br />Expense</span>
            </button>

            <button className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group">
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-slate-800 group-hover:scale-105 transition">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Request<br />Money</span>
            </button>

            <button className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition text-center group">
              <div className="w-11 h-11 rounded-2xl border border-slate-100 bg-[#F8FAFC] flex items-center justify-center text-slate-800 group-hover:scale-105 transition">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 leading-tight">Set<br />Limits</span>
            </button>
          </div>
        </div>

        {/* Circle Wallet */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#EEF4FF] to-[#F5F8FF] rounded-3xl p-5 border border-blue-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Circle Wallet</span>
          </div>

          <div className="my-2">
            <div className="text-[11px] text-slate-500">Shared Balance</div>
            <div className="text-2xl font-black text-slate-900">
              ₹ {circleBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <button
            onClick={() => setCircleBalance(prev => prev + 1000)}
            className="w-full py-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50/50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      {/* Row 2: Sub-navigation Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveCircleTab('members')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition ${
            activeCircleTab === 'members'
              ? 'bg-[#0066FF] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members ({circleMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('expenses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition ${
            activeCircleTab === 'expenses'
              ? 'bg-[#0066FF] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Shared Expenses</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('approvals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition ${
            activeCircleTab === 'approvals'
              ? 'bg-[#0066FF] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Approvals ({pendingApprovals.length})</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition ${
            activeCircleTab === 'settings'
              ? 'bg-[#0066FF] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Row 3: Members List & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circle Members (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Circle Members</h3>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Add Member</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {circleMembers.map((member) => (
              <div key={member.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs`}>
                    {member.initial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{member.name}</div>
                    <div className="text-[11px] text-slate-400">{member.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Spending Limit</span>
                    <span className="text-xs font-bold text-slate-800">
                      ₹ {member.limit.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals & Activity (Right Column) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Pending Approvals */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Pending Approvals ({pendingApprovals.length})
              </h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No pending approval requests.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-[#F8FAFD] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        {req.category.includes('Amazon') ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {req.user} {req.type}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {req.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Circle Activity */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Recent Circle Activity</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    Rahul added ₹ 5,000 to Circle Wallet
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Today, 5:14 PM</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    Paid ₹ 649.00 for Netflix (Shared)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Yesterday, 9:05 PM</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    Anjali joined the Circle
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">29 Oct, 4:22 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900">Add Circle Member</h4>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={addMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g., Sneha Sharma"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Spending Limit (₹)</label>
                <input
                  type="number"
                  value={newMemberLimit}
                  onChange={(e) => setNewMemberLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Add to Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
