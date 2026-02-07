
import React from 'react';
import { TabType, User } from '../types';

interface ProfileProps {
  user: User;
  balance: number;
  orderCount: number;
  onNavigate: (tab: TabType) => void;
}

export const ProfileView: React.FC<ProfileProps> = ({ user, balance, orderCount, onNavigate }) => {
  return (
    <div className="px-6 py-6 space-y-8">
      <div className="space-y-1 px-0.5">
        <h1 className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tight leading-none">Profile</h1>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold tracking-[0.15em] uppercase">Account details</p>
      </div>

      <div className="p-6 rounded-[36px] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-none space-y-7 transition-all">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[28px] bg-slate-50 dark:bg-slate-700 border-4 border-white dark:border-slate-700 shadow-xl p-0.5 overflow-hidden">
             <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-[24px]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
              {user.isVerified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>}
            </div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{user.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', val: orderCount, tab: 'orders' },
            { label: 'Rating', val: '4.8', tab: null },
            { label: 'Balance', val: `₹${balance}`, tab: 'wallet' }
          ].map((stat, i) => (
            <button 
              key={i}
              onClick={() => stat.tab && onNavigate(stat.tab as TabType)}
              className="bg-slate-50/60 dark:bg-slate-700/50 rounded-[22px] p-4 flex flex-col items-center border border-transparent hover:border-slate-100 dark:hover:border-slate-600 transition-all active:scale-95"
            >
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stat.val}</span>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: '📦', label: 'Order History', tab: 'orders' },
          { icon: '💳', label: 'Wallet & Payments', tab: 'wallet' },
          { icon: '📍', label: 'Saved Addresses' },
          { icon: '🔔', label: 'Notifications' },
          { icon: '🎧', label: 'Help & Support' },
          { icon: '⚙️', label: 'Settings' }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => item.tab && onNavigate(item.tab as TabType)}
            className="w-full p-4 rounded-[28px] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center gap-4 active:scale-[0.98] transition-all premium-shadow group hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div className="w-12 h-12 rounded-[18px] bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl group-active:bg-[#FFF8E1] dark:group-active:bg-amber-400/20 transition-colors shadow-inner">
              {item.icon}
            </div>
            <span className="flex-1 text-left font-extrabold text-[14px] text-slate-900 dark:text-slate-200 tracking-tight">{item.label}</span>
            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
};
