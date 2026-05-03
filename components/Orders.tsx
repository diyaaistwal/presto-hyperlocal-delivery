
import React, { useState, useMemo, useEffect } from 'react';

export const OrdersView: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🟩 FETCH ORDERS
  const fetchOrders = () => {
    fetch("https://presto-backend-ckt0.onrender.com/orders")
      .then(res => res.json())
      .then(data => {

        const formatted = data.map((order: any, index: number) => ({
          id: order._id,
          name: order.userRequest,
          price: "₹--",
          partner: "Delivery Partner",

          // 🔥 DEMO STATUS FIX
          status: index % 2 === 0 ? "pending" : "completed",

          progress: index % 2 === 0 ? 40 : 100,
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

  // optional auto refresh
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // 🟩 FILTER LOGIC
  const filteredOrders = useMemo(() => {
    return localOrders.filter(order => {
      const isOngoing = order.status !== 'completed';

      if (activeTab === 'ongoing' && !isOngoing) return false;
      if (activeTab === 'past' && isOngoing) return false;

      return true;
    });
  }, [localOrders, activeTab]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-600';
      case 'completed': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between">
        <h1 className="text-xl font-bold">My Orders</h1>
        <button
          onClick={handleRefresh}
          className={`p-2 ${isRefreshing ? 'animate-spin' : ''}`}
        >
          🔄
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={activeTab === 'ongoing' ? 'font-bold' : ''}
        >
          Ongoing
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={activeTab === 'past' ? 'font-bold' : ''}
        >
          Past
        </button>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="border p-4 rounded-xl">

              <div className="flex justify-between">
                <h3>{order.name}</h3>
                <span>{order.price}</span>
              </div>

              <div className="flex justify-between mt-2 text-sm">
                <span>{order.partner}</span>
                <span className={`px-2 py-1 rounded ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {activeTab === 'ongoing' && (
                <div className="mt-2">
                  <div className="bg-gray-200 h-2 rounded">
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
