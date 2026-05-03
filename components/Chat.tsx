import React, { useState, useEffect } from 'react';
import { Message, Partner } from '../types';

interface ChatProps {
  partner?: Partner | null;
  initialRequest: string;
  onClose: () => void;
}

export const ChatView: React.FC<ChatProps> = ({
  partner,
  initialRequest,
  onClose
}) => {

  if (!partner) return null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 🟩 CREATE ORDER ON START
  useEffect(() => {
    if (!initialRequest) return;

    // Show first message
    setMessages([
      {
        id: "1",
        sender: "user",
        text: initialRequest,
        timestamp: getTime(),
        type: "text"
      }
    ]);

    // 🔥 Create order in DB
    fetch("https://presto-backend-ckt0.onrender.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userRequest: initialRequest
      })
    })
      .then(res => res.json())
      .then(data => {
        setOrderId(data._id);
      });

  }, [initialRequest]);

  // 🟩 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim()) return;

    const text = input;

    // Add message to UI
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text,
        timestamp: getTime(),
        type: "text"
      }
    ]);

    setInput("");

    // 🔥 Save user message
    if (orderId) {
      await fetch("https://presto-backend-ckt0.onrender.com/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          sender: "user",
          text
        })
      });
    }

    // 🔥 Call chat API
    const res = await fetch("https://presto-backend-ckt0.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        partner: partner.name
      })
    });

    const data = await res.json();
    const reply = data.reply || "Got it 👍";

    // Add reply to UI
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "partner",
        text: reply,
        timestamp: getTime(),
        type: "text"
      }
    ]);

    // 🔥 Save reply to DB
    if (orderId) {
      await fetch("https://presto-backend-ckt0.onrender.com/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          sender: "partner",
          text: reply
        })
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">

      {/* HEADER */}
      <div className="flex justify-between p-4 border-b">
        <button onClick={onClose}>←</button>
        <h2>{partner.name}</h2>
        <div></div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[75%] ${
              msg.sender === "user"
                ? "ml-auto bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex p-3 border-t gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded-xl"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
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
