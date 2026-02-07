
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'wallet', label: 'Wallet', icon: 'M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'orders', label: 'Orders', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <nav className="flex-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-50/80 dark:border-slate-800/80 safe-bottom">
      <div className="grid grid-cols-4 w-full h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full transition-all duration-300 ${isActive ? 'scale-100' : 'opacity-40 hover:opacity-100 active:scale-90'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-amber-400 dark:bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30' : 'text-slate-500 dark:text-slate-400'}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d={tab.icon} />
                 </svg>
              </div>
              <span className={`text-[9px] font-black mt-1 uppercase tracking-tighter transition-colors ${isActive ? 'text-slate-900 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-1.5 right-[20%] w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full animate-in zoom-in duration-300"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
