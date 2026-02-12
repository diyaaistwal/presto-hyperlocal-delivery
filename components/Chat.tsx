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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
          text: `Hi Rahul! I'm ${partner?.name || 'your rider'}. I'm heading towards the store now. Any special instructions?`,
          timestamp: getTime(),
          type: 'text'
        };
        setMessages(prev => [...prev, partnerMsg]);
        setIsTyping(false);
      }, 1500);
    }, 1000);
  }, [initialRequest, partner]);

  const handleSend = async (customText?: string) => {
    const userText = customText || input.trim();
    if (!userText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: getTime(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://presto-backend-ckt0.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userText,
            partner: partner?.name || "Rider"
          })
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      const assistantText = data.reply || "I'm on it!";

      const assistantMsg: Message = {
        id: Date.now().toString(),
        sender: 'partner',
        text: assistantText,
        timestamp: getTime(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (
        assistantText.toLowerCase().includes('summary') ||
        assistantText.toLowerCase().includes('total')
      ) {
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
    } catch (error) {
      console.error("Chat Error:", error);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* UI remains same — no AI logic here */}
    </div>
  );
};
