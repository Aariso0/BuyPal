import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  Search,
  X,
  ChevronDown,
  Sparkles,
  Star,
  Heart,
  ShoppingCart,
  Cpu,
  HardDrive,
  Monitor,
  CheckCircle2,
  Tv,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProductComparisonView() {
  const { setCurrentView, shoppingSearchQuery, setShoppingSearchQuery } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSpecTab, setActiveSpecTab] = useState('specs');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [checkoutTriggered, setCheckoutTriggered] = useState(false);

  const categories = ['All', 'Laptops', 'Mobiles', 'Audio', 'Wearables'];

  const merchants = [
    {
      name: 'Amazon',
      icon: 'a',
      color: 'bg-amber-100 text-amber-800',
      price: '69,990',
      discount: '18%',
      inStock: true
    },
    {
      name: 'Flipkart',
      icon: 'f',
      color: 'bg-yellow-100 text-yellow-800',
      price: '70,490',
      discount: '17%',
      inStock: true
    },
    {
      name: 'Croma',
      icon: 'C',
      color: 'bg-teal-100 text-teal-800',
      price: '71,990',
      discount: '15%',
      inStock: true
    },
    {
      name: 'Lenovo',
      icon: 'L',
      color: 'bg-red-100 text-red-800',
      price: '72,499',
      discount: '15%',
      inStock: true
    }
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="AI Shopping"
        subtitle="Search, compare, and buy products with the help of BuyPal AI."
      />

      {/* Search Header Bar with Categories */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
        {/* Search Query Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={shoppingSearchQuery}
            onChange={(e) => setShoppingSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E8EDF5] rounded-full pl-11 pr-10 py-2.5 text-xs md:text-sm font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <button
            onClick={() => setShoppingSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shrink-0">
            <span>More</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Recommendation Hero Card */}
      <div className="relative bg-gradient-to-r from-[#8B5CF6]/20 via-[#A855F7]/10 to-[#6366F1]/15 rounded-3xl p-5 border border-purple-200/50 shadow-card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-extrabold text-purple-900 tracking-wide uppercase">
            AI Recommendation
          </h3>
          <span className="text-xs text-slate-500">
            – Based on your search, here's the best match for performance, price and reviews.
          </span>
        </div>

        {/* Inner Product Card */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Laptop Preview Graphic */}
          <div className="md:col-span-4 flex items-center justify-center p-4 bg-slate-900 rounded-2xl relative overflow-hidden shadow-md">
            <div className="text-center text-white py-6">
              <div className="text-xs font-extrabold tracking-widest text-cyan-400">Lenovo</div>
              <div className="text-2xl font-black tracking-tight text-white mt-1">LOQ</div>
              <div className="text-[10px] text-slate-400 mt-2 font-mono">144Hz FHD Gaming</div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-5 space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Lenovo LOQ i5 (12th Gen)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Intel Core i5-12450H • 16 GB RAM • 512 GB SSD<br />
              RTX 3050 • 15.6" FHD 144Hz
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-900">4.6</span>
              <span className="text-xs text-slate-400">(12,840 reviews)</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="md:col-span-3 flex flex-col items-end justify-center space-y-3">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">₹ 69,990</div>
              <div className="flex items-center gap-2 justify-end text-xs">
                <span className="text-slate-400 line-through">₹ 84,990</span>
                <span className="font-bold text-emerald-600">↓ 18%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full justify-end">
              <button
                onClick={() => setCheckoutTriggered(true)}
                className="flex-1 max-w-[170px] py-2.5 px-4 bg-[#0066FF] hover:bg-[#0052D4] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy with BuyPal</span>
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2.5 rounded-xl border transition ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Compare Prices + BuyPal AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Compare Prices Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-bold text-sm">📊</span>
            <h3 className="font-bold text-slate-900 text-sm">Compare Prices</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {merchants.map((m, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center font-bold text-xs`}>
                    {m.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-xs font-black text-slate-900">₹ {m.price}</span>
                  <span className="text-xs font-bold text-emerald-600">↓ {m.discount}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>In Stock</span>
                  </span>
                  <button
                    onClick={() => setCheckoutTriggered(true)}
                    className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BuyPal AI Insights */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-600 font-bold text-sm">✨</span>
            <h3 className="font-bold text-slate-900 text-sm">BuyPal AI Insights</h3>
          </div>

          <div className="space-y-3.5 my-auto text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Lowest price: <strong>₹ 69,990</strong> on Amazon</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>6% lower</strong> than average market price</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Highly rated for <strong>gaming & coding</strong></span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Good deal for students (<strong>18% off</strong>)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Verified across 4 merchants</span>
            <span className="font-bold text-blue-600">Updated 5m ago</span>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: Specifications */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
          <button
            onClick={() => setActiveSpecTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSpecTab === 'specs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveSpecTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSpecTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Price History
          </button>
          <button
            onClick={() => setActiveSpecTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSpecTab === 'reviews'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Reviews (12.8K)
          </button>
          <button
            onClick={() => setActiveSpecTab('similar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSpecTab === 'similar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Similar Products
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <Cpu className="w-5 h-5 text-slate-700 mb-1.5" />
            <div className="text-[11px] font-bold text-slate-900">Intel Core i5</div>
            <div className="text-[10px] text-slate-500">(12th Gen)</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <Layers className="w-5 h-5 text-slate-700 mb-1.5" />
            <div className="text-[11px] font-bold text-slate-900">16 GB</div>
            <div className="text-[10px] text-slate-500">DDR5 RAM</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <HardDrive className="w-5 h-5 text-slate-700 mb-1.5" />
            <div className="text-[11px] font-bold text-slate-900">512 GB</div>
            <div className="text-[10px] text-slate-500">SSD</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <Tv className="w-5 h-5 text-slate-700 mb-1.5" />
            <div className="text-[11px] font-bold text-slate-900">RTX 3050</div>
            <div className="text-[10px] text-slate-500">(6 GB)</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <Monitor className="w-5 h-5 text-slate-700 mb-1.5" />
            <div className="text-[11px] font-bold text-slate-900">15.6" FHD</div>
            <div className="text-[10px] text-slate-500">(144 Hz)</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <svg className="w-5 h-5 fill-slate-700 mb-1.5" viewBox="0 0 24 24">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.051-1.749"/>
            </svg>
            <div className="text-[11px] font-bold text-slate-900">Windows 11</div>
            <div className="text-[10px] text-slate-500">Home</div>
          </div>
        </div>
      </div>

      {/* Checkout Policy Intent Modal (Separating Discovery from Checkout) */}
      {checkoutTriggered && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">Purchase Intent Confirmation</h4>
              </div>
              <button
                onClick={() => setCheckoutTriggered(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-slate-700 mb-4 space-y-1">
              <div className="font-bold text-slate-900">Lenovo LOQ i5 (12th Gen)</div>
              <div>Merchant: <strong>Amazon</strong> (Lowest Price Match)</div>
              <div>Total: <strong className="text-blue-700">₹ 69,990</strong></div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Under BuyPal delegated authority policies, delegated users require approval from the primary account owner (Rahul Verma) before checkout completion.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setCheckoutTriggered(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCheckoutTriggered(false);
                  setCurrentView('circle');
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Request Circle Approval →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
