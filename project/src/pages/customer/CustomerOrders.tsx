import React, { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order, OrderItem, OrderStatus } from '../../lib/types';
import Badge from '../../components/ui/Badge';

interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: { name: string; image_url: string } | null })[];
}

export default function CustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, image_url, price))')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderWithItems[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-orange-400" /></div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders yet</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(e => e === order.id ? null : order.id)}
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge label={order.status} variant={order.status as OrderStatus} />
                <span className="text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-gray-50 px-5 py-4 bg-gray-50/50">
                <div className="mb-3 text-xs text-gray-500">
                  <span className="font-medium">Shipping to:</span> {order.shipping_address}
                </div>
                <div className="space-y-2">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <span className="flex-1 text-sm text-gray-700 font-medium line-clamp-1">{item.product?.name || 'Product'}</span>
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
