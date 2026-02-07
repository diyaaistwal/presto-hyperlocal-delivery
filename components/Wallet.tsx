
import React, { useState } from 'react';
import { Transaction } from '../types';

interface WalletProps {
  balance: number;
  transactions: Transaction[];
  onUpdateBalance: (amount: number, tx: Transaction) => void;
}

type ProcessingState = 'none' | 'adding' | 'withdrawing';

export const WalletView: React.FC<WalletProps> = ({ balance, transactions, onUpdateBalance }) => {
  const [processing, setProcessing] = useState<ProcessingState>('none');
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateTransaction = async (type: 'add' | 'withdraw') => {
    setProcessing(type === 'add' ? 'adding' : 'withdrawing');
    const delay = 800 + Math.random() * 800;
    await new Promise(resolve => setTimeout(resolve, delay));

    const amount = type === 'add' ? 1000 : -500;
    if (type === 'withdraw' && balance < 500) {
      alert("Insufficient balance to withdraw.");
      setProcessing('none');
      return;
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: type === 'add' ? 'topup' : 'payment',
      title: type === 'add' ? 'Wallet Top-up' : 'Wallet Withdrawal',
      subtitle: type === 'add' ? 'Added via HDFC UPI' : 'To Bank Account',
      amount: `${amount > 0 ? '+' : ''}₹${Math.abs(amount)}`,
      date: 'Just now',
      isPositive: amount > 0,
      status: 'successful',
      icon: type === 'add' ? '⚡' : '🏦',
      color: type === 'add' ? 'amber' : 'slate'
    };

    onUpdateBalance(amount, newTx);
    setProcessing('none');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="px-6 py-6 space-y-7">
      <div className="flex justify-between items-end px-0.5">
        <div>
          <h1 className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tight leading-none">My Wallet</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold tracking-[0.15em] uppercase mt-1.5">Manage your balance</p>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 active:scale-90 hover:bg-slate-100 dark:hover:bg-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
        </button>
      </div>

      <div className={`relative bg-slate-900 dark:bg-slate-800 rounded-[40px] p-7 text-white overflow-hidden shadow-2xl transition-all duration-500 ${showSuccess ? 'ring-4 ring-emerald-400/30' : ''}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-7">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-black uppercase tracking-[0.2em]">Available Balance</span>
              <h2 className={`text-5xl font-[900] tracking-tighter transition-all duration-300 ${showSuccess ? 'text-emerald-400 scale-105 origin-left' : ''}`}>
                ₹{balance}
              </h2>
            </div>
            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500 shadow-lg ${showSuccess ? 'bg-emerald-400 text-slate-900' : 'bg-amber-400 text-slate-900 shadow-amber-400/20'}`}>
              {showSuccess ? <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => simulateTransaction('add')}
              disabled={processing !== 'none'}
              className="flex-1 bg-amber-400 text-slate-900 py-4 rounded-[22px] font-[900] text-[11px] uppercase tracking-widest transition-all hover:bg-amber-300 active:scale-95 disabled:opacity-50"
            >
              {processing === 'adding' ? <div className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Working</div> : 'Add Money'}
            </button>
            <button 
              onClick={() => simulateTransaction('withdraw')}
              disabled={processing !== 'none'}
              className="flex-1 bg-white/10 backdrop-blur-md text-white py-4 rounded-[22px] font-[900] text-[11px] uppercase tracking-widest border border-white/10 transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
            >
              {processing === 'withdrawing' ? <div className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Working</div> : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-0.5">Transaction History</h4>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 rounded-[28px] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center gap-4 transition-all premium-shadow group hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="w-12 h-12 rounded-[18px] bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:bg-[#FFF8E1] dark:group-hover:bg-amber-400/20 transition-colors shadow-inner">
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h6 className="font-extrabold text-[14px] text-slate-900 dark:text-white truncate pr-2">{tx.title}</h6>
                  <span className={`font-black text-[14px] ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-200'}`}>{tx.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{tx.date}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${tx.status === 'successful' ? 'bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600' : 'bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400'}`}>{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
