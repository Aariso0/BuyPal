import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopNav from '../components/TopNav';
import {
  CreditCard,
  ArrowDownToLine,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  ChevronRight,
  Copy,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export default function TransactionsView() {
  const { transactions, selectedTransaction, setSelectedTransaction } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'payments', label: 'Payments' },
    { id: 'receives', label: 'Receives' },
    { id: 'orders', label: 'Orders' },
    { id: 'refunds', label: 'Refunds' },
  ];

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'payments') return tx.amount < 0;
    if (activeFilter === 'receives') return tx.amount > 0 && tx.status !== 'Refunded';
    if (activeFilter === 'orders') return tx.subtitle.includes('Order');
    if (activeFilter === 'refunds') return tx.status === 'Refunded';
    return true;
  });

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F4F7FC] p-8 overflow-y-auto">
      <TopNav
        title="Transactions"
        subtitle="Track all your payments, orders, and wallet activities in one place."
      />

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Spent */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black">₹ 58,240</div>
            <div className="flex items-center gap-1 text-[11px] text-white/80 mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>12% from last month</span>
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
              <span>18% from last month</span>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net Balance</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">₹ 4,260</div>
            <div className="text-[11px] text-slate-400 mt-1">Positive cash flow</div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">17</div>
            <div className="text-[11px] text-slate-400 mt-1">in last 30 days</div>
          </div>
        </div>
      </div>

      {/* Row 2: Filter Tabs & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Last 30 Days ▾</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Row 3: Ledger Table & Transaction Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Transaction</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition ${
                      selectedTransaction?.id === tx.id ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-4 font-medium text-slate-600 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                          {tx.icon === 'a' ? 'a' : tx.icon === 'f' ? 'f' : tx.icon === 'c' ? 'C' : '👤'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{tx.merchant}</div>
                          <div className="text-[10px] text-slate-400">{tx.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 font-medium text-slate-600">
                      {tx.method}
                    </td>

                    <td className="py-4 text-right font-black">
                      <span className={tx.amount < 0 ? 'text-red-500' : 'text-emerald-600'}>
                        {tx.amount < 0 ? `- ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}` : `+ ₹ ${tx.amount.toLocaleString('en-IN')}`}
                      </span>
                    </td>

                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {tx.status === 'Completed' ? '✓' : '↺'} {tx.status}
                      </span>
                    </td>

                    <td className="py-4 text-right text-slate-400">
                      <ChevronRight className="w-4 h-4 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Details Side Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8EDF5] shadow-card flex flex-col justify-between">
          {selectedTransaction ? (
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4">Transaction Details</h3>

              {/* Merchant Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-100">
                    {selectedTransaction.icon === 'a' ? 'a' : '🛒'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{selectedTransaction.merchant}</h4>
                    <p className="text-[10px] text-slate-400">{selectedTransaction.subtitle}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ✓ {selectedTransaction.status}
                </span>
              </div>

              {/* Key Details Rows */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-black text-slate-900 text-base">
                    ₹ {Math.abs(selectedTransaction.amount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Method</span>
                  <span className="font-bold text-slate-800">{selectedTransaction.method}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="font-medium text-slate-800">{selectedTransaction.date}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Transaction ID</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800">
                    <span>{selectedTransaction.id}</span>
                    <button
                      onClick={() => handleCopyId(selectedTransaction.id)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button className="w-full py-3 border border-blue-600 text-blue-600 hover:bg-blue-50/50 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition">
                  <span>View Order</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a transaction to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
