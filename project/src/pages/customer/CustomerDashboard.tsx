import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order } from '../../lib/types';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import type { OrderStatus } from '../../lib/types';

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, image_url))')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const totalSpent = orders.reduce((s, o) => s + o.total_amount, 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-6 text-white">
        <p className="text-orange-100 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold mb-4">{profile?.full_name || 'Customer'}</h1>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon={<Package className="w-5 h-5" />} color="orange" />
        <StatCard label="Total Spent" value={`$${totalSpent.toFixed(0)}`} icon={<ShoppingBag className="w-5 h-5" />} color="blue" />
        <StatCard label="Delivered" value={delivered} icon={<Heart className="w-5 h-5" />} color="green" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/customer/orders" className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-orange-400" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No orders yet</p>
            <Link to="/products" className="text-orange-500 text-sm hover:underline mt-2 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map(order => (
              <div key={order.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</p>
                  <Badge label={order.status} variant={order.status as OrderStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
