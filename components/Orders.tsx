
import React, { useState, useMemo, useEffect } from 'react';
import { Order } from '../types';

interface OrdersProps {
  orders: Order[];
}

export const OrdersView: React.FC<OrdersProps> = ({ orders: initialOrders }) => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');
  const [filterCategory, setFilterCategory] = useState<'all' | 'food' | 'grocery' | 'pharmacy'>('all');
  const [localOrders, setLocalOrders] = useState<Order[]>(initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { setLocalOrders(initialOrders); }, [initialOrders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalOrders(prev => prev.map(order => {
        if (order.status === 'delivered' || order.status === 'completed') return order;
        const newProgress = Math.min(order.progress + Math.random() * 1.5, 100);
        let newStatus: Order['status'] = order.status;
        if (newProgress >= 100) newStatus = 'completed';
        else if (newProgress > 40 && order.status === 'pending') newStatus = 'assigned';
        return { ...order, progress: newProgress, status: newStatus };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  const filteredOrders = useMemo(() => {
    return localOrders.filter(order => {
      const isOngoing = order.status !== 'delivered' && order.status !== 'completed';
      if (activeTab === 'ongoing' && !isOngoing) return false;
      if (activeTab === 'past' && isOngoing) return false;
      if (filterCategory !== 'all' && order.category !== filterCategory) return false;
      return true;
    });
  }, [localOrders, activeTab, filterCategory]);

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'food', label: 'Food', icon: '🍔' },
    { id: 'grocery', label: 'Groceries', icon: '🛒' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊' }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400';
      case 'assigned': return 'bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400';
      case 'completed': return 'bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400';
      case 'delivered': return 'bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-500';
      default: return 'bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-500';
    }
  };

  return (
    <div className="px-6 py-6 space-y-7">
      <div className="flex justify-between items-end px-0.5">
        <div>
          <h1 className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tight leading-none">My Orders</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold tracking-[0.15em] uppercase mt-1.5">Your delivery history</p>
        </div>
        <button onClick={handleRefresh} className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 active:scale-90 transition-transform hover:bg-slate-100 dark:hover:bg-slate-700 ${isRefreshing ? 'animate-spin' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      <div className="bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-[26px] flex">
        <button onClick={() => setActiveTab('ongoing')} className={`flex-1 py-3 rounded-[20px] text-[10px] font-[900] uppercase tracking-wider transition-all ${activeTab === 'ongoing' ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}>Ongoing</button>
        <button onClick={() => setActiveTab('past')} className={`flex-1 py-3 rounded-[20px] text-[10px] font-[900] uppercase tracking-wider transition-all ${activeTab === 'past' ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}>Past</button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight whitespace-nowrap transition-all border ${
              filterCategory === cat.id ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-5 rounded-[36px] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none group transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-[22px] bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-3xl shadow-inner group-hover:bg-[#FFF8E1] dark:group-hover:bg-amber-400/20 transition-colors">{order.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h6 className="font-extrabold text-[15px] text-slate-900 dark:text-white truncate pr-2 tracking-tight">{order.name}</h6>
                    <span className="font-black text-xs text-slate-900 dark:text-slate-900 bg-slate-50 dark:bg-amber-400 px-2 py-1 rounded-lg shrink-0">{order.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate max-w-[120px]">{order.partner}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span>
                  </div>
                </div>
              </div>

              {activeTab === 'ongoing' ? (
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${order.progress}%` }}></div>
                  </div>
                  <button className="w-full py-4 rounded-[22px] bg-slate-900 dark:bg-slate-700 text-white font-[900] text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:opacity-90">Track Order</button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{order.time}</span>
                  <button className="px-5 py-2.5 rounded-[18px] bg-amber-400 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm active:scale-95 hover:bg-amber-300 transition-all">Reorder</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
             <div className="text-5xl mb-4 grayscale opacity-40">📦</div>
             <p className="text-[11px] font-black uppercase tracking-widest">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
