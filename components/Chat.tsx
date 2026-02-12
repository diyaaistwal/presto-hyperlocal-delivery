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

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-slate-900">
        <p className="text-slate-500">Loading chat...</p>
      </div>
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  useEffect(() => {
    if (!initialRequest) return;

    const userMsg: Message = {
      id: 'init-user',
      sender: 'user',
      text: initialRequest,
      timestamp: getTime(),
      type: 'text'
    };

    setMessages([userMsg]);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const partnerMsg: Message = {
          id: 'p-init',
          sender: 'partner',
          text: `Hi Rahul! I'm ${partner.name}. I'm heading towards the store now. Any special instructions?`,
          timestamp: getTime(),
          type: 'text'
        };
        setMessages(prev => [...prev, partnerMsg]);
        setIsTyping(false);
      }, 1200);
    }, 800);
  }, [initialRequest, partner]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: getTime(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://presto-backend-ckt0.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userText,
            partner: partner.name
          })
        }
      );

      const data = await response.json();

      const assistantMsg: Message = {
        id: Date.now().toString(),
        sender: 'partner',
        text: data.reply || "I'm on it 👍",
        timestamp: getTime(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (error) {
      console.error(error);

      const errorMsg: Message = {
        id: Date.now().toString(),
        sender: 'system',
        text: "⚠️ Unable to connect to server.",
        timestamp: getTime(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onClose}>←</button>
        <div>
          <h2 className="font-bold">{partner.name}</h2>
          <p className="text-xs text-gray-400">★ {partner.rating}</p>
        </div>
        <div className="font-bold">₹{totalAmount || '--'}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-3 rounded-xl ${
              msg.sender === 'user'
                ? 'ml-auto bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-400">Typing...</div>}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Message your rider..."
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};
