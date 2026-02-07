
import React from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
      <div className="animate-in fade-in zoom-in duration-700">
        <Logo className="w-48 h-48 mb-8" />
      </div>
      <div className="mt-4 flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
};
