
export type TabType = 'home' | 'wallet' | 'orders' | 'profile';

export interface User {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  isVerified: boolean;
}

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  deliveryFee: number;
  eta: string;
  distance: string;
  isBestChoice?: boolean;
}

export interface Order {
  id: string;
  name: string;
  partner: string;
  status: 'pending' | 'assigned' | 'completed' | 'delivered';
  time: string;
  timestamp: number;
  price: string;
  icon: string;
  category: 'food' | 'grocery' | 'pharmacy';
  progress: number;
  color: string;
  items?: Array<{ name: string; price: number }>;
}

export interface Transaction {
  id: string;
  type: 'refund' | 'payment' | 'topup';
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  isPositive: boolean;
  status: 'successful' | 'pending' | 'failed';
  icon: string;
  color: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'system' | 'partner';
  text?: string;
  timestamp: string;
  type?: 'text' | 'system-update' | 'order-summary';
  actions?: string[];
  summaryData?: {
    store: string;
    items: Array<{ name: string; price: number }>;
    deliveryFee: number;
    serviceCharge: number;
    total: number;
  };
}
