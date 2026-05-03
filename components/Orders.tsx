import React, { useState, useMemo, useEffect } from 'react';
import { Order } from '../types';

export const OrdersView: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');
  const [filterCategory, setFilterCategory] = useState<'all' | 'food' | 'grocery' | 'pharmacy'>('all');
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🟩 FETCH ORDERS FROM BACKEND
  const fetchOrders = () => {
    fetch("https://presto-backend-ckt0.onrender.com/orders")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Orders:", data);

        // 🔥 Map DB → UI format
        const formatted = data.map((order: any) => ({
          id: order._id,
          name: order.userRequest,
          price: "₹--",
          partner: "Partner Assigned",
          status: order.status || "pending",
          progress: order.status === "completed" ? 100 : 30,
          category: "grocery",
          icon: "🛒",
          time: "Just now"
        }));

        setLocalOrders(formatted);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // optional auto-refresh every 5 sec
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fetchOrders();
    setTimeout(() => setIsRefreshing(false), 800);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-600';
      case 'assigned': return 'bg-amber-50 text-amber-600';
      case 'completed': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="px-6 py-6 space-y-7">

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-gray-400 text-xs">Your delivery history</p>
        </div>

        <button onClick={handleRefresh} className={`p-2 rounded-xl bg-gray-100 ${isRefreshing ? 'animate-spin' : ''}`}>
          🔄
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('ongoing')} className={activeTab === 'ongoing' ? 'font-bold' : ''}>
          Ongoing
        </button>
        <button onClick={() => setActiveTab('past')} className={activeTab === 'past' ? 'font-bold' : ''}>
          Past
        </button>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="p-4 border rounded-xl">

              <div className="flex justify-between">
                <h3 className="font-bold">{order.name}</h3>
                <span>{order.price}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>{order.partner}</span>
                <span className={`px-2 py-1 rounded ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {activeTab === 'ongoing' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};
