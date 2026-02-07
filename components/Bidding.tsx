
import React from 'react';
import { Partner } from '../types';

interface BiddingProps {
  onClose: () => void;
  onSelectPartner: (partner: Partner) => void;
}

export const BiddingView: React.FC<BiddingProps> = ({ onClose, onSelectPartner }) => {
  const mockPartners: Partner[] = [
    {
      id: 'p1',
      name: 'Amit Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      rating: 4.9,
      reviews: 128,
      deliveryFee: 45,
      eta: '12 mins',
      distance: '1.2 km',
      isBestChoice: true
    },
    {
      id: 'p2',
      name: 'Suresh Raina',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
      rating: 4.7,
      reviews: 85,
      deliveryFee: 30,
      eta: '18 mins',
      distance: '2.5 km'
    },
    {
      id: 'p3',
      name: 'Rohan Mehra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
      rating: 4.5,
      reviews: 42,
      deliveryFee: 25,
      eta: '22 mins',
      distance: '3.1 km'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex-none px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="font-black text-slate-900 dark:text-white tracking-tight text-[16px]">Choose Your Partner</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{mockPartners.length} Partners Available · All Verified</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
        {mockPartners.map((partner) => (
          <div key={partner.id} className="relative group animate-in slide-in-from-bottom duration-500">
            {partner.isBestChoice && (
              <div className="absolute -top-2.5 right-6 z-10 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                Best Choice
              </div>
            )}
            <div className={`p-5 rounded-[32px] border ${partner.isBestChoice ? 'border-amber-400 ring-2 ring-amber-400/10' : 'border-slate-100 dark:border-slate-800'} bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all`}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-[22px] bg-slate-50 dark:bg-slate-700 p-0.5 border border-slate-100 dark:border-slate-600 shadow-inner overflow-hidden">
                  <img src={partner.avatar} className="w-full h-full object-cover rounded-[20px]" alt={partner.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-[16px] text-slate-900 dark:text-white tracking-tight">{partner.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-lg">
                      <span className="text-amber-500 text-[10px]">★</span>
                      <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">{partner.rating}</span>
                      <span className="text-[9px] text-amber-600/50 dark:text-amber-400/50 font-bold">({partner.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold">₹{partner.deliveryFee} fee</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold">{partner.eta}</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold">{partner.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onSelectPartner(partner)}
                className={`w-full py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${partner.isBestChoice ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200'}`}
              >
                Select This Partner
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
