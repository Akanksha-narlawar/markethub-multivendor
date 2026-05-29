export type UserRole = 'customer' | 'vendor' | 'admin';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_approved: boolean;
  avatar_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  vendor?: Profile;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  created_at: string;
  customer?: Profile;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Grocery',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
  'Automotive',
  'Other',
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'vendor'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'vendor'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id' | 'created_at' | 'product'>;
        Update: Partial<Omit<CartItem, 'id' | 'created_at' | 'product'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'customer' | 'order_items'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'customer' | 'order_items'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at' | 'product'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at' | 'product'>>;
      };
    };
  };
};
