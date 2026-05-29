import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Profile, Order } from '../../lib/types';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import type { OrderStatus } from '../../lib/types';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ users: 0, vendors: 0, products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingVendors, setPendingVendors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id, role', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'vendor'),
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('id, total_amount, status, created_at, customer_id, shipping_address, customer:profiles(full_name)', { count: 'exact' }).order('created_at', { ascending: false }).limit(6),
      supabase.from('profiles').select('*').eq('role', 'vendor').eq('is_approved', false),
    ]).then(([users, vendors, products, orders, pending]) => {
      const totalRevenue = (orders.data as Order[] ?? []).reduce((s, o) => s + o.total_amount, 0);
      setStats({
        users: users.count ?? 0,
        vendors: vendors.count ?? 0,
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        revenue: totalRevenue,
      });
      setRecentOrders((orders.data as Order[]) ?? []);
      setPendingVendors((pending.data as Profile[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-3xl p-6 text-white">
        <p className="text-rose-100 text-sm mb-1">Admin Control Panel</p>
        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
        <p className="text-rose-200 text-sm mt-1">Full system access</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.users} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard label="Vendors" value={stats.vendors} icon={<TrendingUp className="w-5 h-5" />} color="orange" />
        <StatCard label="Products" value={stats.products} icon={<Package className="w-5 h-5" />} color="green" />
        <StatCard label="Orders" value={stats.orders} icon={<ShoppingCart className="w-5 h-5" />} color="amber" />
      </div>

      {/* Pending Vendor Approvals */}
      {pendingVendors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-amber-100">
            <h2 className="font-bold text-amber-800">Pending Vendor Approvals ({pendingVendors.length})</h2>
            <Link to="/admin/users" className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-amber-100">
            {pendingVendors.slice(0, 3).map(v => (
              <div key={v.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">{v.full_name}</p>
                  <p className="text-xs text-amber-600">{v.email}</p>
                </div>
                <Badge label="Pending" variant="pending-approval" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-rose-500 font-medium hover:text-rose-600 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-rose-400" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map(order => (
              <div key={order.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{(order.customer as { full_name?: string })?.full_name || 'Customer'} · {new Date(order.created_at).toLocaleDateString()}</p>
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
