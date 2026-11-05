import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation state: defaults to 'dashboard', can be toggled to any of the 16 views
  const [currentView, setCurrentView] = useState('dashboard');
  
  // User profile
  const [user, setUser] = useState({
    name: 'Shivashish Sharma',
    email: 'shivashish@buypal.com',
    phone: '+91 7000523511',
    buypalId: 'shivashish@pay',
    handle: '@shivashish',
    avatarText: 'SS',
    isVerified: true,
    currency: 'INR (₹)',
    timeZone: 'Asia/Kolkata (IST)',
    language: 'English (India)'
  });

  // Financial States
  const [walletBalance, setWalletBalance] = useState(12480.50);
  const [circleBalance, setCircleBalance] = useState(8500.00);
  const [monthlyLimit] = useState(25000);
  const [monthlySpent, setMonthlySpent] = useState(15420);
  const [showBalance, setShowBalance] = useState(true);

  // Shopping mode: 'assisted' | 'autonomous'
  const [shoppingMode, setShoppingMode] = useState('assisted');

  // Search state
  const [shoppingSearchQuery, setShoppingSearchQuery] = useState('Lenovo LOQ i5 12th Gen');

  // Circle members
  const [circleMembers, setCircleMembers] = useState([
    { id: 1, name: 'Rahul Verma', role: 'You • Circle Owner', limit: 10000, initial: 'RV', color: 'bg-purple-100 text-purple-700' },
    { id: 2, name: 'Anjali Kapur', role: 'Member', limit: 10000, initial: 'AK', color: 'bg-sky-100 text-sky-700' },
    { id: 3, name: 'Mohit Singh', role: 'Member', limit: 5000, initial: 'MS', color: 'bg-amber-100 text-amber-700' },
    { id: 4, name: 'Priya Desai', role: 'Member', limit: 5000, initial: 'PD', color: 'bg-emerald-100 text-emerald-700' },
  ]);

  // Pending Circle Approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'appr-1',
      user: 'Anjali Kapur',
      type: 'requested payment',
      description: 'Amazon • ₹ 3,299.00',
      amount: 3299.00,
      category: 'Amazon Shopping'
    },
    {
      id: 'appr-2',
      user: 'Mohit Singh',
      type: 'requested money',
      description: '₹ 1,500.00 • For groceries',
      amount: 1500.00,
      category: 'Groceries'
    }
  ]);

  // Transactions ledger
  const [transactions, setTransactions] = useState([
    {
      id: 'BP2648395721',
      date: 'Nov 04, 2026, 10:24 AM',
      merchant: 'Amazon',
      subtitle: 'Order #AMZ892341',
      method: 'BuyPal Wallet',
      amount: -69990.00,
      status: 'Completed',
      type: 'payment',
      icon: 'a'
    },
    {
      id: 'BP2648395722',
      date: 'Nov 03, 2026, 07:18 PM',
      merchant: 'Received from Rohit',
      subtitle: 'Circle Transfer',
      method: 'BuyPal Circle',
      amount: 5000.00,
      status: 'Completed',
      type: 'receive',
      icon: 'user'
    },
    {
      id: 'BP2648395723',
      date: 'Nov 02, 2026, 03:05 PM',
      merchant: 'Flipkart',
      subtitle: 'Order #FLP768210',
      method: 'BuyPal Wallet',
      amount: -4999.00,
      status: 'Completed',
      type: 'payment',
      icon: 'f'
    },
    {
      id: 'BP2648395724',
      date: 'Nov 01, 2026, 11:47 AM',
      merchant: 'Sent to Neha',
      subtitle: 'UPI Transfer',
      method: 'Bank •••• 4821',
      amount: -2000.00,
      status: 'Completed',
      type: 'payment',
      icon: 'user'
    },
    {
      id: 'BP2648395725',
      date: 'Oct 30, 2026, 09:21 PM',
      merchant: 'Refund from Croma',
      subtitle: 'Order #CRM553210',
      method: 'BuyPal Wallet',
      amount: 1500.00,
      status: 'Refunded',
      type: 'refund',
      icon: 'c'
    }
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(transactions[0]);

  // Approval handlers
  const handleApprove = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  const handleReject = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  const addWalletMoney = (amount) => {
    setWalletBalance(prev => prev + Number(amount));
  };

  const sendMoney = (amount, to, note) => {
    setWalletBalance(prev => Math.max(0, prev - Number(amount)));
    const newTx = {
      id: 'BP' + Math.floor(1000000000 + Math.random() * 9000000000),
      date: 'Just now',
      merchant: `Sent to ${to}`,
      subtitle: note || 'Transfer',
      method: 'BuyPal Wallet',
      amount: -Number(amount),
      status: 'Completed',
      type: 'payment',
      icon: 'user'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        setUser,
        walletBalance,
        setWalletBalance,
        circleBalance,
        setCircleBalance,
        monthlyLimit,
        monthlySpent,
        setMonthlySpent,
        showBalance,
        setShowBalance,
        shoppingMode,
        setShoppingMode,
        shoppingSearchQuery,
        setShoppingSearchQuery,
        circleMembers,
        setCircleMembers,
        pendingApprovals,
        handleApprove,
        handleReject,
        transactions,
        selectedTransaction,
        setSelectedTransaction,
        addWalletMoney,
        sendMoney
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
