import React from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowDownToLine,
  PiggyBank,
  Tag,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="Analytics"
        subtitle="Track your spending, savings, and shopping insights with AI."
      />

      {/* Row 1: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Spending */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">Total Spending</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black">₹ 58,240</div>
            <div className="flex items-center gap-1 text-[11px] text-white/80 mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>12% vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Received */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Received</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">₹ 62,500</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>18% vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Savings</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">₹ 4,320</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>27% vs last month</span>
            </div>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">₹ 3,425</div>
            <div className="flex items-center gap-1 text-[11px] text-red-500 font-bold mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>8% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Spending Overview (Area Curve) & Spending by Category (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Spending Overview Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">📈</span>
              <h3 className="font-bold text-slate-900 text-sm">Spending Overview</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>This Month</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Last Month</span>
              </span>
            </div>
          </div>

          {/* SVG Smooth Wave Area Chart */}
          <div className="relative w-full h-52 my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Dashed baseline last month */}
              <path
                d="M 0 140 Q 70 120, 140 130 T 280 110 T 420 80 T 500 70"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Purple Area */}
              <path
                d="M 0 150 Q 80 120, 160 135 T 320 100 T 420 60 L 500 50 L 500 180 L 0 180 Z"
                fill="url(#areaGradient)"
              />

              {/* Solid Purple Curve */}
              <path
                d="M 0 150 Q 80 120, 160 135 T 320 100 T 420 60 L 500 50"
                fill="none"
                stroke="#6D28D9"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Marker Tag */}
              <circle cx="496" cy="50" r="5" fill="#6D28D9" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Peak Floating Badge */}
            <div className="absolute right-0 top-3 bg-purple-700 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
              ₹ 58,240
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
            <span>Oct 1</span>
            <span>Oct 5</span>
            <span>Oct 9</span>
            <span>Oct 13</span>
            <span>Oct 17</span>
            <span>Oct 21</span>
            <span>Oct 25</span>
            <span>Oct 30</span>
          </div>
        </div>

        {/* Spending by Category Donut */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-600 font-bold">⭕</span>
            <h3 className="font-bold text-slate-900 text-sm">Spending by Category</h3>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeDasharray="42 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#06B6D4" strokeWidth="4.5" strokeDasharray="12 100" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="10 100" strokeDashoffset="-72" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-82" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-black text-slate-900">₹ 58,240</span>
                <span className="text-[10px] text-slate-400">Total Spent</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                  Electronics
                </span>
                <span className="font-bold text-slate-900">42%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                  Fashion
                </span>
                <span className="font-bold text-slate-900">18%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
                  Groceries
                </span>
                <span className="font-bold text-slate-900">12%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  Education
                </span>
                <span className="font-bold text-slate-900">10%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  Others
                </span>
                <span className="font-bold text-slate-900">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Monthly Comparison Bar Chart + AI Insights + Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Comparison */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Monthly Comparison</h3>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-purple-700">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> Spent
              </span>
              <span className="flex items-center gap-1 text-sky-600">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span> Received
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[
              { m: 'Jun', s: 45, r: 55 },
              { m: 'Jul', s: 60, r: 75 },
              { m: 'Aug', s: 70, r: 85 },
              { m: 'Sep', s: 50, r: 65 },
              { m: 'Oct', s: 75, r: 88 },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="flex items-end gap-1 h-32">
                  <div
                    className="w-3.5 bg-purple-600 rounded-t-md transition-all duration-500"
                    style={{ height: `${bar.s}%` }}
                  ></div>
                  <div
                    className="w-3.5 bg-sky-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${bar.r}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-600 font-bold">✨</span>
            <h3 className="font-bold text-slate-900 text-sm">AI Insights</h3>
          </div>

          <div className="space-y-3 my-auto text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>You spent <strong>42% on Electronics</strong> this month.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Your spending is <strong>12% lower</strong> than last month.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>You saved <strong>₹ 4,320</strong> with BuyPal deals.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Consider a better deal: similar items are <strong>6–8% cheaper</strong> on Amazon.</span>
            </div>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Top Merchants</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 font-black text-[11px] flex items-center justify-center">a</span>
                <span className="font-bold text-slate-800">Amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">₹ 24,990</span>
                <span className="text-[10px] text-slate-400">(42%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-yellow-50 text-yellow-700 font-black text-[11px] flex items-center justify-center">f</span>
                <span className="font-bold text-slate-800">Flipkart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">₹ 10,490</span>
                <span className="text-[10px] text-slate-400">(18%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 font-black text-[11px] flex items-center justify-center">C</span>
                <span className="font-bold text-slate-800">Croma</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">₹ 7,290</span>
                <span className="text-[10px] text-slate-400">(12%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-50 text-red-700 font-black text-[11px] flex items-center justify-center">L</span>
                <span className="font-bold text-slate-800">Lenovo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">₹ 6,990</span>
                <span className="text-[10px] text-slate-400">(12%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-black text-[11px] flex items-center justify-center">🛍</span>
                <span className="font-bold text-slate-800">Others</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">₹ 8,480</span>
                <span className="text-[10px] text-slate-400">(16%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
