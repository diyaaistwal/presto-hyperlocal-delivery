import React, { useState, useEffect, useRef } from 'react';
import { Message, Order, Partner } from '../types';

interface ChatProps {
  partner?: Partner | null;
  initialRequest: string;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const ChatView: React.FC<ChatProps> = ({
  partner,
  initialRequest,
  onClose,
  onOrderPlaced
}) => {

  if (!partner) return null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (!initialRequest) return;

    const firstMsg: Message = {
      id: 'init',
      sender: 'user',
      text: initialRequest,
      timestamp: getTime(),
      type: 'text'
    };

    setMessages([firstMsg]);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'welcome',
            sender: 'partner',
            text: `Hi! I'm ${partner.name}. I'm heading to the store 🚀`,
            timestamp: getTime(),
            type: 'text'
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }, 800);
  }, [initialRequest, partner]);

  const handleSend = async (custom?: string) => {
    const text = custom || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: getTime(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      const res = await fetch(
        "https://presto-backend-ckt0.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            partner: partner.name
          })
        }
      );

      const data = await res.json();

      const reply = data.reply || "Got it 👍";

      const partnerMsg: Message = {
        id: Date.now().toString(),
        sender: 'partner',
        text: reply,
        timestamp: getTime(),
        type: 'text'
      };

      setMessages(prev => [...prev, partnerMsg]);

      // Trigger order summary UI if reply contains summary/total
      if (
        reply.toLowerCase().includes("summary") ||
        reply.toLowerCase().includes("total")
      ) {
        const summary: Message = {
          id: 'summary',
          sender: 'system',
          timestamp: getTime(),
          type: 'order-summary',
          summaryData: {
            store: "Fresh Mart",
            items: [
              { name: "Milk", price: 60 },
              { name: "Bread", price: 40 }
            ],
            deliveryFee: partner.deliveryFee,
            serviceCharge: 10,
            total: 110 + partner.deliveryFee
          }
        };

        setMessages(prev => [...prev, summary]);
        setTotalAmount(110 + partner.deliveryFee);
      }

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: "error",
          sender: "system",
          text: "⚠️ Server not reachable",
          timestamp: getTime(),
          type: "text"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "Check price",
    "Add item",
    "Confirm order",
    "Cancel item"
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onClose}>←</button>
        <div>
          <h2 className="font-bold">{partner.name}</h2>
          <p className="text-xs text-gray-400">★ {partner.rating}</p>
        </div>
        <div className="font-bold">₹{totalAmount || '--'}</div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.type === "text" && (
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            )}

            {msg.type === "order-summary" && msg.summaryData && (
              <div className="bg-black text-white p-5 rounded-3xl">
                <h4 className="font-bold mb-3">
                  {msg.summaryData.store}
                </h4>

                {msg.summaryData.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}

                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{msg.summaryData.total}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-gray-400 text-sm">Typing...</div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* QUICK REPLIES */}
      {showQuickReplies && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {quickReplies.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-4 py-2 bg-amber-200 rounded-xl text-xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="p-4 border-t flex gap-2">
        <button
          onClick={() => setShowQuickReplies(!showQuickReplies)}
          className="px-3 bg-gray-200 rounded-xl"
        >
          +
        </button>

        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Message your rider..."
        />

        <button
          onClick={() => handleSend()}
          className="bg-black text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};
