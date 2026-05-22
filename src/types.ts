export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Bridal' | 'Stone' | 'Velvet' | 'Designer' | 'Traditional' | 'Minimalist';
  price: number;
  imageUrl: string;
  size: 'Small' | 'Medium' | 'Large' | 'Combo';
  color: string;
  stoneType: string;
  recommendedFaceShapes: ('Round' | 'Oval' | 'Heart' | 'Square' | 'Diamond')[];
  rating: number;
  reviews: { author: string; rating: number; text: string; date: string }[];
  stock: number;
  tags: string[];
}

export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'VIP';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  registrationDate: string;
  ordersCount: number;
  lifetimeValue: number;
  tier: CustomerTier;
  points: number;
  wishlist: string[]; // Product IDs
  favoriteStyle: string; // e.g. "Oval - Festival"
  segment: 'Bridal' | 'Festive' | 'Daily' | 'Premium';
  lastActivity: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Try-On User' | 'Newsletter' | 'Contact Form' | 'WhatsApp';
  status: 'New' | 'Contacted' | 'Highly Interested' | 'Converted';
  notes: string;
  date: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  paymentMethod: 'COD' | 'Card';
  trackingNumber?: string;
}

export interface Campaign {
  id: string;
  title: string;
  channel: 'Email' | 'WhatsApp' | 'SMS';
  subject: string;
  body: string;
  segment: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  status: 'Draft' | 'Sent';
  date: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  category: 'Styling Assistance' | 'Delivery' | 'Payments' | 'Quality';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}
