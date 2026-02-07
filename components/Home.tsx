
import React, { useState, useMemo } from 'react';
import { TabType, Order, User } from '../types';

interface HomeProps {
  user: User;
  orders: Order[];
  onStartChat: (request: string) => void;
  onNavigate: (tab: TabType) => void;
}

export const HomeView: React.FC<HomeProps> = ({ user, orders, onStartChat, onNavigate }) => {
  const [request, setRequest] = useState('');

  const liveOrder = useMemo(() => {
    return orders.find(o => o.status !== 'delivered' && o.status !== 'completed');
  }, [orders]);

  const popularRequests = [
    { 
      id: '1', 
      icon: '🍔', 
      title: 'Food Pickup', 
      provider: "McDonald's, CP", 
      color: 'amber', 
      eta: '15-20m',
      prompt: "I want to order a McDonald's Burger Combo from Connaught Place." 
    },
    { 
      id: '2', 
      icon: '🛒', 
      title: 'Grocery Run', 
      provider: 'Essentials nearby', 
      color: 'emerald', 
      eta: '10-15m',
      prompt: 'I need to pick up milk, bread, and eggs from the nearby grocery store.' 
    },
    { 
      id: '3', 
      icon: '💊', 
      title: 'Pharmacy', 
      provider: 'Apollo Pharmacy', 
      color: 'blue', 
      eta: '20-30m',
      prompt: 'Please get my prescription medicines from Apollo Pharmacy.' 
    }
  ];

  const handleSendRequest = () => {
    if (request.trim()) {
      onStartChat(request);
      setRequest('');
    }
  };

  return (
    <div className="px-6 py-6 space-y-7">
      {/* Header Greeting */}
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tight leading-none">Hey, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold tracking-[0.15em] uppercase">Life, delivered in minutes</p>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 p-0.5 ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all active:scale-90 hover:ring-slate-100 dark:hover:ring-slate-700"
        >
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
        </button>
      </div>

      {/* Live Order Card */}
      {liveOrder && (
        <section className="space-y-3">
          <div className="flex justify-between items-center px-0.5">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Tracking Order
            </h4>
            <button onClick={() => onNavigate('orders')} className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest active:opacity-60">
              Details
            </button>
          </div>

          <button 
            onClick={() => onNavigate('orders')}
            className="w-full text-left relative bg-slate-900 dark:bg-slate-800 rounded-[32px] p-6 text-white shadow-xl shadow-slate-900/20 overflow-hidden active:scale-[0.98] transition-all hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[50px] translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/5 shadow-inner">
                  {liveOrder.icon}
                </div>
                <div>
                  <h5 className="font-extrabold text-[15px] tracking-tight mb-0.5">{liveOrder.name}</h5>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">{liveOrder.status === 'assigned' ? 'Out for delivery' : liveOrder.status}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-white leading-none block">{liveOrder.time}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">ETA</span>
              </div>
            </div>

            <div className="relative z-10 mt-5">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${liveOrder.progress}%` }}
                ></div>
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Input Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-0.5">What do you need?</h4>
        <div className="bg-[#FFF8E1] dark:bg-slate-800/50 rounded-[36px] p-1.5 shadow-xl shadow-amber-900/5 dark:shadow-none border border-amber-100/20 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-5 shadow-sm min-h-[140px] flex flex-col justify-between focus-within:ring-2 ring-amber-400/20 transition-all border border-transparent dark:border-slate-700/50">
            <textarea
              className="w-full h-24 resize-none outline-none text-[15px] text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 font-semibold leading-relaxed bg-transparent"
              placeholder="Pizza from Joey's, medicines from Apollo, or groceries from 24/7..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSendRequest}
                disabled={!request.trim()}
                className={`px-7 py-3.5 rounded-[20px] flex items-center gap-2.5 font-black text-[11px] uppercase tracking-widest transition-all ${
                  request.trim() 
                    ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg active:scale-90 hover:opacity-90' 
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-600'
                }`}
              >
                Send Request
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shortcut Grid */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-0.5">Quick Orders</h4>
        <div className="grid grid-cols-1 gap-3">
          {popularRequests.map((item) => (
            <button 
              key={item.id} 
              onClick={() => onStartChat(item.prompt)}
              className="p-4 rounded-[28px] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-[0.98] group premium-shadow"
            >
              <div className="w-14 h-14 rounded-[20px] bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-3xl group-hover:bg-[#FFF8E1] dark:group-hover:bg-amber-400/20 transition-all">
                {item.icon}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h5 className="font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight truncate">{item.title}</h5>
                  <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-2 py-1 rounded-lg shrink-0">{item.eta}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{item.provider}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
