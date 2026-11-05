import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Send,
  ArrowDownToLine,
  Search,
  UserPlus,
  Copy,
  Share2,
  ArrowRight,
  Check,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export default function SendReceiveView() {
  const { user, sendMoney } = useApp();
  const [activeTab, setActiveTab] = useState('send'); // 'send' | 'receive'
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('1000');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const chips = ['500', '1000', '2000', '5000'];

  const contacts = [
    { name: 'Rahul Verma', initials: 'RV', color: 'bg-purple-100 text-purple-700' },
    { name: 'Anjali Kapur', initials: 'AK', color: 'bg-sky-100 text-sky-700' },
    { name: 'Mohit Singh', initials: 'MS', color: 'bg-amber-100 text-amber-700' },
    { name: 'Priya Desai', initials: 'PD', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Rohan Dubey', initials: 'RD', color: 'bg-rose-100 text-rose-700' },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (sendTo && amount) {
      sendMoney(amount, sendTo, note);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setSendTo('');
        setNote('');
      }, 3000);
    }
  };

  const copyId = () => {
    navigator.clipboard?.writeText(user.buypalId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="Send & Receive"
        subtitle="Send money to anyone, receive payments, and manage your transfers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Send / Receive Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Toggle Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'send'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Send className="w-4 h-4 -rotate-12" />
              <span>Send Money</span>
            </button>
            <button
              onClick={() => setActiveTab('receive')}
              className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'receive'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Receive Money</span>
            </button>
          </div>

          {/* Send Money Form Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Send Money</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pay to a contact, UPI ID, phone number or bank account.
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-5">
              {/* Send To */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Send To</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="Enter name, UPI ID, phone number or bank details"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Amount</label>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                    required
                  />
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-2">
                  {chips.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => setAmount(chip)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                        amount === chip
                          ? 'border-2 border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ₹ {Number(chip).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Note */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">Add a Note (Optional)</label>
                  <span className="text-[10px] text-slate-400">{note.length}/50</span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Dinner, Shopping, Rent"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Send Money</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {sentSuccess && (
                <p className="text-center text-xs font-bold text-emerald-600">
                  ✓ Money sent successfully!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Receive Money + Recent Contacts + Transfers */}
        <div className="lg:col-span-5 space-y-5">
          {/* Receive Money Card */}
          <div className="bg-gradient-to-br from-[#EEF4FF] to-[#F5F8FF] rounded-3xl p-6 border border-blue-100 shadow-card">
            <h3 className="text-lg font-bold text-slate-900">Receive Money</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Share your BuyPal ID or UPI QR to receive payments.
            </p>

            <div className="flex items-center gap-5 bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
              {/* QR Code graphic */}
              <div className="w-24 h-24 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center relative shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M10 10h30v30h-30z M15 15v20h20v-20z M60 10h30v30h-30z M65 15v20h20v-20z M10 60h30v30h-30z M15 65v20h20v-20z M45 10h10v10h-10z M45 30h10v10h-10z M10 45h10v10h-10z M30 45h10v10h-10z M45 45h10v10h-10z M60 45h10v10h-10z M80 45h10v10h-10z M45 60h10v10h-10z M60 60h10v10h-10z M75 60h10v10h-10z M60 75h10v10h-10z M75 75h15v15h-15z" fill="#0F172A" />
                  <rect x="42" y="42" width="16" height="16" rx="4" fill="#0066FF" />
                </svg>
              </div>

              {/* ID & Copy */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-slate-400 font-semibold">Your BuyPal ID</div>
                <div className="text-sm font-black text-slate-900 truncate">
                  {user.buypalId}
                </div>
                <button
                  onClick={copyId}
                  className="mt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>
            </div>

            <button className="w-full mt-3 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50/50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share QR / ID</span>
            </button>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent Contacts</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-1">
              {contacts.map((contact, idx) => (
                <div
                  key={idx}
                  onClick={() => setSendTo(contact.name)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs group-hover:scale-105 transition`}>
                    {contact.initials}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 mt-1.5 text-center leading-tight">
                    {contact.name.split(' ')[0]}<br />{contact.name.split(' ')[1] || ''}
                  </span>
                </div>
              ))}

              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                  +
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1.5 leading-tight text-center">
                  Add<br />Contact
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent Transfers</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sent to Rahul Verma</div>
                    <div className="text-[10px] text-slate-400">UPI Transfer</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-red-500">- ₹ 1,200.00</div>
                  <div className="text-[10px] text-slate-400">Yesterday, 9:18 PM</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Received from Anjali Kapur</div>
                    <div className="text-[10px] text-slate-400">BuyPal</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600">+ ₹ 2,000.00</div>
                  <div className="text-[10px] text-slate-400">Yesterday, 6:04 PM</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sent to Family Circle</div>
                    <div className="text-[10px] text-slate-400">Shared Payment</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-red-500">- ₹ 649.00</div>
                  <div className="text-[10px] text-slate-400">29 Oct, 4:22 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
