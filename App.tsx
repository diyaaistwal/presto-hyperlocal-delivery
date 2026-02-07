
import React, { useState, useEffect, useMemo } from 'react';
import { HomeView } from './components/Home';
import { WalletView } from './components/Wallet';
import { OrdersView } from './components/Orders';
import { ProfileView } from './components/Profile';
import { ChatView } from './components/Chat';
import { BiddingView } from './components/Bidding';
import { BottomNav } from './components/BottomNav';
import { Logo } from './components/Logo';
import { SplashScreen } from './components/SplashScreen';
import { TabType, Order, Transaction, User, Partner } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewState, setViewState] = useState<'main' | 'bidding' | 'chat'>('main');
  const [initialRequest, setInitialRequest] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLaunching, setIsLaunching] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [user] = useState<User>({
    name: 'Rahul Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=FFF8E1',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    isVerified: true
  });

  const [balance, setBalance] = useState(500);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'on_1',
      name: "McDonald's Burger Combo",
      partner: 'Rajesh Kumar',
      status: 'assigned',
      time: '12 mins',
      timestamp: Date.now(),
      price: '₹350',
      icon: '🛵',
      category: 'food',
      progress: 75,
      color: 'amber'
    },
    {
      id: 'past_1',
      name: "Domino's Pepperoni Pizza",
      partner: 'Amit Shah',
      status: 'delivered',
      time: 'Yesterday',
      timestamp: Date.now() - 86400000,
      price: '₹540',
      icon: '🍕',
      category: 'food',
      progress: 100,
      color: 'rose'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 'tx_1', 
      type: 'refund', 
      title: 'Order Refund', 
      subtitle: "McDonald's order cancelled", 
      amount: '+₹350', 
      date: 'Today, 3:20 PM', 
      isPositive: true, 
      status: 'successful',
      icon: '🍔', 
      color: 'emerald' 
    }
  ]);

  const tabIndex = useMemo(() => {
    const mapping: Record<TabType, number> = { home: 0, wallet: 1, orders: 2, profile: 3 };
    return mapping[activeTab];
  }, [activeTab]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (viewState !== 'main') setViewState('main');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewState]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleStartRequest = (request: string) => {
    setInitialRequest(request);
    setViewState('bidding');
    window.history.pushState({ view: 'bidding' }, '');
  };

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setViewState('chat');
    window.history.pushState({ view: 'chat' }, '');
  };

  const handleUpdateBalance = (amount: number, tx: Transaction) => {
    setBalance(prev => prev + amount);
    setTransactions(prev => [tx, ...prev]);
  };

  const handleAddOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const closeOverlay = () => {
    setViewState('main');
    setSelectedPartner(null);
  };

  return (
    <>
      <div className={`fixed inset-0 z-[100] transition-all duration-700 pointer-events-none ${isLaunching ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
        {isLaunching && <SplashScreen />}
      </div>

      <div className={`flex flex-col h-[100dvh] max-w-md mx-auto bg-white dark:bg-slate-900 relative overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 shadow-2xl transition-opacity duration-700 ${isLaunching ? 'opacity-0' : 'opacity-100'}`}>
        {viewState === 'main' && (
          <header className="flex-none h-16 px-6 flex justify-between items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl sticky top-0 z-[60] border-b border-slate-50/80 dark:border-slate-800/80">
            <div className="flex items-center -ml-5">
              <Logo className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-2">
               <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90">
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                  )}
               </button>
               <button className="w-9 h-9 rounded-xl bg-[#FFF8E1] dark:bg-amber-400/10 border border-amber-100/50 dark:border-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-500 active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </button>
            </div>
          </header>
        )}

        <main className="flex-1 relative overflow-hidden bg-white dark:bg-slate-900">
          {viewState === 'bidding' ? (
            <div className="absolute inset-0 z-[70]">
              <BiddingView onClose={closeOverlay} onSelectPartner={handleSelectPartner} />
            </div>
          ) : viewState === 'chat' ? (
            <div className="absolute inset-0 z-[70]">
              <ChatView 
                partner={selectedPartner}
                initialRequest={initialRequest} 
                onClose={closeOverlay} 
                onOrderPlaced={handleAddOrder}
              />
            </div>
          ) : (
            <div 
              className="flex h-full w-[400%] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: `translateX(-${tabIndex * 25}%)` }}
            >
              <div className="w-1/4 h-full overflow-y-auto no-scrollbar pb-24">
                <HomeView user={user} orders={orders} onStartChat={handleStartRequest} onNavigate={setActiveTab} />
              </div>
              <div className="w-1/4 h-full overflow-y-auto no-scrollbar pb-24">
                <WalletView balance={balance} transactions={transactions} onUpdateBalance={handleUpdateBalance} />
              </div>
              <div className="w-1/4 h-full overflow-y-auto no-scrollbar pb-24">
                <OrdersView orders={orders} />
              </div>
              <div className="w-1/4 h-full overflow-y-auto no-scrollbar pb-24">
                <ProfileView user={user} balance={balance} orderCount={orders.length} onNavigate={setActiveTab} />
              </div>
            </div>
          )}
        </main>

        {viewState === 'main' && (
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </>
  );
};

export default App;
