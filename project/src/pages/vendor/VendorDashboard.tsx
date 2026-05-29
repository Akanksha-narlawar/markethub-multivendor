import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, TrendingUp, ArrowRight, Loader2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, Order, OrderItem } from '../../lib/types';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import type { OrderStatus } from '../../lib/types';

export default function VendorDashboard() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<(OrderItem & { order: Order | null; product: Product | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('products').select('*').eq('vendor_id', user.id),
      supabase
        .from('order_items')
        .select('*, order:orders(id, status, total_amount, created_at, customer_id), product:products(name, image_url)')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8),
    ]).then(([p, o]) => {
      setProducts((p.data as Product[]) ?? []);
      setRecentOrders((o.data as (OrderItem & { order: Order | null; product: Product | null })[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  const totalRevenue = recentOrders.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalSales = recentOrders.reduce((s, i) => s + i.quantity, 0);

  if (!profile?.is_approved) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
        <Clock className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-amber-800 mb-2">Account Pending Approval</h2>
        <p className="text-amber-600 text-sm">An admin needs to approve your vendor account before you can start listing products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-6 text-white">
        <p className="text-blue-100 text-sm mb-1">Vendor Dashboard</p>
        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
        <p className="text-blue-200 text-sm mt-1">{products.length} products listed</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={products.length} icon={<Package className="w-5 h-5" />} color="blue" />
        <StatCard label="Items Sold" value={totalSales} icon={<ShoppingCart className="w-5 h-5" />} color="green" />
        <StatCard label="Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={<DollarSign className="w-5 h-5" />} color="amber" />
        <StatCard label="Active" value={products.filter(p => p.is_active).length} icon={<TrendingUp className="w-5 h-5" />} color="orange" />
      </div>

      {/* Products Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <h2 className="font-bold text-gray-900">My Products</h2>
          <Link to="/vendor/products" className="text-sm text-blue-500 font-medium hover:text-blue-600 flex items-center gap-1">
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No products yet</p>
            <Link to="/vendor/products/add" className="text-blue-500 text-sm hover:underline mt-1 inline-block">Add your first product</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category} · Stock: {p.stock}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-sm text-blue-500 font-medium hover:text-blue-600 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.slice(0, 5).map(item => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.product?.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} · {item.order && new Date(item.order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  {item.order && <Badge label={item.order.status} variant={item.order.status as OrderStatus} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
