
import React, { useState, useEffect, useRef } from 'react';
import { Message, Order, Partner } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ChatProps {
  partner?: Partner | null;
  initialRequest: string;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const ChatView: React.FC<ChatProps> = ({ partner, initialRequest, onClose, onOrderPlaced }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!initialRequest) return;
    
    const userMsg: Message = { id: 'init-user', sender: 'user', text: initialRequest, timestamp: getTime(), type: 'text' };
    setMessages([userMsg]);
    
    // Partner initial greeting
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const partnerMsg: Message = { 
          id: 'p-init', 
          sender: 'partner', 
          text: `Hi Rahul! I'm ${partner?.name || 'your rider'}. I'm heading towards the store now. Any special instructions?`, 
          timestamp: getTime(),
          type: 'text'
        };
        setMessages(prev => [...prev, partnerMsg]);
        setIsTyping(false);
      }, 1500);
    }, 1000);

    // Simulate system update after a few seconds
    setTimeout(() => {
      const systemUpdate: Message = {
        id: 'sys-1',
        sender: 'system',
        text: 'Item "Avocado (2pcs)" is out of stock. Replace with "Avocado (1pc XL)"?',
        timestamp: getTime(),
        type: 'system-update',
        actions: ['Yes', 'No']
      };
      setMessages(prev => [...prev, systemUpdate]);
    }, 8000);
  }, [initialRequest, partner]);

  const handleSend = async (customText?: string) => {
    const userText = customText || input.trim();
    if (!userText) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText, timestamp: getTime(), type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickReplies(false);
    
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `You are the partner rider for Prestó. User: Rahul. Partner: ${partner?.name}. You are helping him pick up items. If he confirms the items, provide a structured order summary. Respond in character.`,
        }
      });

      const assistantText = response.text || "I'm on it!";
      const assistantMsg: Message = { id: Date.now().toString(), sender: 'partner', text: assistantText, timestamp: getTime(), type: 'text' };
      setMessages(prev => [...prev, assistantMsg]);

      // Logic to trigger order summary
      if (assistantText.toLowerCase().includes('summary') || assistantText.toLowerCase().includes('total')) {
        const summary: Message = {
          id: 'summary-' + Date.now(),
          sender: 'system',
          timestamp: getTime(),
          type: 'order-summary',
          summaryData: {
            store: 'Fresh Mart Essentials',
            items: [
              { name: 'Bread (Whole Wheat)', price: 45 },
              { name: 'Milk (1L)', price: 65 },
              { name: 'Eggs (6pcs)', price: 40 }
            ],
            deliveryFee: partner?.deliveryFee || 45,
            serviceCharge: 15,
            total: 165 + (partner?.deliveryFee || 45)
          }
        };
        setMessages(prev => [...prev, summary]);
        setTotalAmount(165 + (partner?.deliveryFee || 45));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string) => {
    handleSend(action);
  };

  const handleAddItems = () => {
    setInput("I want to add another item…");
    inputRef.current?.focus();
  };

  const toggleQuickReplies = () => {
    setShowQuickReplies(!showQuickReplies);
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const quickRequests = [
    { label: 'Food Pickup', icon: '🍔', text: 'Pick up a regular Burger Combo from the store.' },
    { label: 'Grocery Run', icon: '🛒', text: 'I need some milk and bread please.' },
    { label: 'Pharmacy', icon: '💊', text: 'Get my prescription medicines.' }
  ];

  const smartReplies = [
    "Okay, go ahead",
    "How much is it?",
    "Can you check the price?",
    "Got it, thanks!",
    "I'll take the replacement",
    "No, skip that item"
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex-none px-6 h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button onClick={onClose} className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 active:scale-90">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex-1">
          <h2 className="font-black text-slate-900 dark:text-white tracking-tight text-[15px] leading-tight">{partner?.name}</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Online · ★ {partner?.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Total</span>
          <span className="text-[16px] font-black text-slate-900 dark:text-white leading-none">₹{totalAmount || '--'}</span>
        </div>
      </div>

      {/* Chips */}
      <div className="flex-none px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
        {quickRequests.map((chip, i) => (
          <button 
            key={i}
            onClick={() => handleQuickReply(chip.text)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm whitespace-nowrap active:scale-95 transition-all"
          >
            <span className="text-sm">{chip.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-300">{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 no-scrollbar bg-slate-50/10 dark:bg-slate-900/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.type === 'text' && (
              <div className={`max-w-[85%] px-5 py-3.5 shadow-sm text-[14px] font-semibold leading-relaxed animate-in fade-in zoom-in-95 duration-300 ${
                msg.sender === 'user' 
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 rounded-[26px] rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-[26px] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            )}

            {msg.type === 'system-update' && (
              <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-[28px] p-5 space-y-4 animate-in fade-in slide-in-from-left duration-500">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-[13px] font-bold text-blue-900 dark:text-blue-200 leading-snug">{msg.text}</p>
                </div>
                <div className="flex gap-2">
                  {msg.actions?.map(action => (
                    <button 
                      key={action}
                      onClick={() => handleActionClick(action)}
                      className="flex-1 py-2.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msg.type === 'order-summary' && msg.summaryData && (
              <div className="w-full bg-slate-900 dark:bg-slate-800 rounded-[32px] p-6 text-white shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">Store Details</span>
                    <h4 className="text-[16px] font-black tracking-tight">{msg.summaryData.store}</h4>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {msg.summaryData.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[12px]">
                      <span className="text-slate-300 font-bold">{item.name}</span>
                      <span className="font-black">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-bold">Delivery Fee</span>
                    <span className="font-black">₹{msg.summaryData.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-bold">Service Charge</span>
                    <span className="font-black">₹{msg.summaryData.serviceCharge}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-[18px]">
                    <span className="font-black text-amber-400 tracking-tight">Total</span>
                    <span className="font-black tracking-tight">₹{msg.summaryData.total}</span>
                  </div>
                </div>
              </div>
            )}
            <span className="text-[8px] text-slate-300 dark:text-slate-600 font-black mt-1.5 mx-2 uppercase tracking-widest">{msg.timestamp}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-3 rounded-[20px] rounded-tl-none flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Bottom CTA Bar */}
      <div className="flex-none p-4 pb-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Quick Replies Row - Toggleable */}
          {showQuickReplies && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 animate-in slide-in-from-bottom-2 duration-300">
              {smartReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-100 dark:border-amber-400/30 rounded-2xl text-[10px] font-black uppercase tracking-tight text-amber-700 dark:text-amber-400 whitespace-nowrap active:scale-95 transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
             <button 
              onClick={handleAddItems}
              className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
             >
              Add Items
             </button>
             <button 
              onClick={toggleQuickReplies}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all ${showQuickReplies ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
              Quick Replies
             </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-none bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 flex items-center gap-2 border border-slate-100 dark:border-slate-700 flex-1">
              <input 
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent py-3 px-4 text-[13px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold"
                placeholder="Message your rider..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${input.trim() && !isTyping ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg active:scale-90' : 'bg-slate-200 dark:bg-slate-700 text-white dark:text-slate-600 opacity-40'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>

          <button 
            onClick={() => onOrderPlaced({ id: 'order-'+Date.now(), name: 'Hyperlocal Request', partner: partner?.name || 'Amit', status: 'pending', time: '20 mins', timestamp: Date.now(), price: `₹${totalAmount}`, icon: '🛵', category: 'grocery', progress: 5, color: 'emerald' })}
            className={`w-full py-5 rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${totalAmount > 0 ? 'bg-amber-400 text-slate-900 shadow-amber-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
          >
            Complete & Pay ₹{totalAmount || '--'}
          </button>
        </div>
      </div>
    </div>
  );
};
