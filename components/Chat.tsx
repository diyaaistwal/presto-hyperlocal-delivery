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

    // show first message
    setMessages([
      {
        id: "1",
        sender: "user",
        text: initialRequest,
        timestamp: getTime(),
        type: "text"
      }
    ]);

    // create order in DB
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
        console.log("ORDER CREATED:", data);
        setOrderId(data._id);
      })
      .catch(err => console.log("Order error:", err));

  }, [initialRequest]);

  // 🟩 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim()) return;

    // 🔴 WAIT FOR ORDER
    if (!orderId) {
      alert("Please wait... initializing order");
      return;
    }

    const text = input;

    // add user message to UI
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

    console.log("USING ORDER ID:", orderId);

    // save user message
    try {
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
    } catch (err) {
      console.log("Message save error:", err);
    }

    // call chat API
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

      reply =
        data?.reply ||
        data?.message ||
        "Got it 👍";

    } catch (err) {
      console.log("Chat error:", err);
      reply = "Server error. Try again.";
    }

    // show reply in UI
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
    try {
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
    } catch (err) {
      console.log("Reply save error:", err);
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
          disabled={!orderId}
          className="bg-black text-white px-4 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

