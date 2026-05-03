
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

  // 🟩 CREATE ORDER + AUTO MESSAGE
  useEffect(() => {
    if (!initialRequest) return;

    const firstMsg = {
      id: "1",
      sender: "user",
      text: initialRequest,
      timestamp: getTime(),
      type: "text"
    };

    setMessages([firstMsg]);

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

        // 🔥 AUTO MESSAGE
        setTimeout(() => {
          const autoReply = {
            id: "auto1",
            sender: "partner",
            text: `Hi! I'm ${partner.name}. I've accepted your order 🚀`,
            timestamp: getTime(),
            type: "text"
          };

          setMessages(prev => [...prev, autoReply]);

          // save auto reply
          fetch("https://presto-backend-ckt0.onrender.com/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data._id,
              sender: "partner",
              text: autoReply.text
            })
          });
        }, 800);
      })
      .catch(err => console.log("Order error:", err));

  }, [initialRequest, partner]);

  // 🟩 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim()) return;

    if (!orderId) {
      alert("Please wait...");
      return;
    }

    const text = input;

    // show user message
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

    // save user message
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

    // get reply
    let reply = "Got it 👍";

    try {
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
      reply = data?.reply || "Got it 👍";

    } catch (err) {
      reply = "Server error.";
    }

    // show reply
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

    // save reply
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
          disabled={!orderId}
          className="bg-black text-white px-4 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};
