import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Sparkles,
  ArrowRight,
  Send,
  Laptop,
  Headphones,
  Smartphone,
  RefreshCw,
  ShoppingBag,
  Search,
  CheckCircle2,
  Info,
  Sliders,
  TrendingDown,
  Bot,
  Zap
} from 'lucide-react';

export default function AIShoppingView() {
  const {
    setCurrentView,
    shoppingMode,
    setShoppingMode,
    shoppingSearchQuery,
    setShoppingSearchQuery
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  const handleSearch = (query) => {
    setShoppingSearchQuery(query || inputVal || 'Lenovo LOQ i5 12th Gen');
    setCurrentView('product-detail');
  };

  const trendingPicks = [
    {
      id: 1,
      name: 'Lenovo LOQ i5 (12th Gen)',
      price: '69,990',
      original: '84,990',
      discount: '18%',
      img: '💻'
    },
    {
      id: 2,
      name: 'Sony WH-CH720N',
      price: '8,490',
      original: '9,990',
      discount: '15%',
      img: '🎧'
    },
    {
      id: 3,
      name: 'boAt Wave Sigma 3',
      price: '1,399',
      original: '2,999',
      discount: '53%',
      img: '⌚'
    },
    {
      id: 4,
      name: 'iPhone 16 (128 GB)',
      price: '74,900',
      original: '79,990',
      discount: '6%',
      img: '📱'
    }
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="AI Shopping"
        subtitle="Shop smarter with AI. Find products, compare prices, and pay securely with BuyPal."
      />

      {/* Row 1: AI Hero Banner + Shopping Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Banner */}
        <div className="lg:col-span-8 relative bg-gradient-to-r from-[#6355F6] via-[#7B61FF] to-[#986BFF] text-white rounded-3xl p-8 shadow-card flex flex-col justify-between min-h-[180px] overflow-hidden">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Your AI Shopping Assistant
            </h2>
            <p className="text-white/80 text-sm mt-1.5 font-normal">
              Find products, compare prices, get the best deals.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSearch('Lenovo LOQ i5 12th Gen')}
              className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center gap-2"
            >
              <span>Start AI Shopping</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>

        {/* Shopping Modes Switcher */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Shopping Modes</h3>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-2.5 my-2">
            {/* Assisted Shopping */}
            <div
              onClick={() => setShoppingMode('assisted')}
              className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                shoppingMode === 'assisted'
                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Assisted Shopping</div>
                  <div className="text-[10px] text-slate-500">AI finds, you review & pay</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                shoppingMode === 'assisted' ? 'border-blue-600' : 'border-slate-300'
              }`}>
                {shoppingMode === 'assisted' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </div>
            </div>

            {/* Autonomous Shopping */}
            <div
              onClick={() => setShoppingMode('autonomous')}
              className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                shoppingMode === 'autonomous'
                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Autonomous Shopping</div>
                  <div className="text-[10px] text-slate-500">AI buys with your approval rules</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                shoppingMode === 'autonomous' ? 'border-blue-600' : 'border-slate-300'
              }`}>
                {shoppingMode === 'autonomous' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            PayPal-linked policy bounds active
          </div>
        </div>
      </div>

      {/* Row 2: Ask BuyPal AI + Shopping Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Ask BuyPal AI Bar & Chips */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Ask BuyPal AI</h3>
          </div>

          {/* Search Input with Send button */}
          <div className="relative mb-4">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(inputVal)}
              placeholder="Find a product, compare prices or ask anything..."
              className="w-full pl-5 pr-14 py-3.5 bg-white border border-slate-200 rounded-full text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs"
            />
            <button
              onClick={() => handleSearch(inputVal)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center hover:bg-[#0052D4] shadow-xs transition"
            >
              <Send className="w-4 h-4 -rotate-12 translate-x-0.5" />
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSearch('Find a laptop under ₹70,000')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 transition"
            >
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>Find a laptop under ₹70,000</span>
            </button>

            <button
              onClick={() => handleSearch('Best headphones for students')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 transition"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-500" />
              <span>Best headphones for students</span>
            </button>

            <button
              onClick={() => handleSearch('Compare iPhone 16 prices')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Compare iPhone 16 prices</span>
            </button>

            <button
              onClick={() => handleSearch("Today's best deals")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Today's best deals</span>
            </button>
          </div>
        </div>

        {/* Shopping Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-sm">Your Shopping Summary</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 text-center">
            <div>
              <div className="text-xl font-black text-slate-900">12</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">AI Searches</div>
            </div>
            <div className="border-x border-slate-100">
              <div className="text-xl font-black text-slate-900">5</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Purchases</div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">₹ 58,240</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Total Spent</div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3 rounded-xl text-center">
            ✓ Smart Assistant saved you ₹ 4,320 this month
          </div>
        </div>
      </div>

      {/* Row 3: Trending Picks + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trending Picks for You */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Trending Picks for You</h3>
            <button
              onClick={() => handleSearch('Trending Deals')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {trendingPicks.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSearch(item.name)}
                className="border border-slate-100 rounded-2xl p-3 flex flex-col justify-between hover:shadow-md hover:border-blue-200 cursor-pointer transition group"
              >
                <div>
                  <div className="h-28 bg-[#F8FAFD] rounded-xl flex items-center justify-center text-4xl mb-2.5 group-hover:scale-105 transition">
                    {item.img}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">₹ {item.price}</span>
                    <span className="text-[10px] text-slate-400 line-through">₹ {item.original}</span>
                    <span className="text-[10px] font-bold text-emerald-600">↓ {item.discount}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch(item.name);
                    }}
                    className="w-full mt-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Buy with BuyPal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Insights</h3>
          </div>

          <div className="space-y-3.5 my-auto text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <strong>₹4,320 saved</strong> on your last 3 purchases.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <strong>Price drop alert:</strong> Lenovo LOQ is 6% lower now.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                A better deal is available on Amazon (<strong>save ₹ 1,500</strong>).
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSearch('Lenovo LOQ')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition text-center"
          >
            Review Deal Recommendations →
          </button>
        </div>
      </div>
    </div>
  );
}
