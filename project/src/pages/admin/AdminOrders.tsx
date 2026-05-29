import React, { useEffect, useState } from 'react';
import { Loader2, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem, OrderStatus } from '../../lib/types';
import Badge from '../../components/ui/Badge';

interface FullOrder extends Order {
  customer: { full_name: string; email: string } | null;
  order_items: (OrderItem & { product: { name: string } | null })[];
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetch = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, customer:profiles(full_name, email), order_items(*, product:products(name))')
      .order('created_at', { ascending: false });
    setOrders((data as FullOrder[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetch();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-rose-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">All Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders yet</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="px-5 py-4 flex flex-wrap items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(e => e === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">
                  {order.customer?.full_name || 'Customer'} · {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value as OrderStatus); }}
                  onClick={e => e.stopPropagation()}
                  className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <span className="text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
            {expanded === order.id && (
              <div className="border-t border-gray-50 px-5 py-4 bg-gray-50/50">
                <div className="text-xs text-gray-500 mb-3">
                  <span className="font-medium">Customer:</span> {order.customer?.email} |{' '}
                  <span className="font-medium">Ship to:</span> {order.shipping_address}
                </div>
                <div className="space-y-2">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                      <span className="flex-1 text-sm text-gray-700 font-medium">{item.product?.name || 'Product'}</span>
                      <span className="text-xs text-gray-400">x{item.quantity}</span>
                      <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
