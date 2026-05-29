import React, { useEffect, useState } from 'react';
import { Loader2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order, OrderItem, OrderStatus } from '../../lib/types';
import Badge from '../../components/ui/Badge';

interface VendorOrderItem extends OrderItem {
  order: (Order & { customer: { full_name: string; email: string } | null }) | null;
  product: { name: string; image_url: string } | null;
}

export default function VendorOrders() {
  const { user } = useAuth();
  const [items, setItems] = useState<VendorOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('order_items')
      .select('*, order:orders(*, customer:profiles(full_name, email)), product:products(name, image_url)')
      .eq('vendor_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems((data as VendorOrderItem[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const groupedByOrder = items.reduce((acc, item) => {
    const orderId = item.order_id;
    if (!acc[orderId]) acc[orderId] = { order: item.order, items: [] };
    acc[orderId].items.push(item);
    return acc;
  }, {} as Record<string, { order: VendorOrderItem['order']; items: VendorOrderItem[] }>);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-blue-400" /></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Orders for My Products</h1>

      {Object.keys(groupedByOrder).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders yet</p>
        </div>
      ) : (
        Object.entries(groupedByOrder).map(([orderId, { order, items: orderItems }]) => {
          const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
          return (
            <div key={orderId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(e => e === orderId ? null : orderId)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">Order #{orderId.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">
                    {order?.customer?.full_name || 'Customer'} · {order && new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge label={order?.status || 'pending'} variant={(order?.status || 'pending') as OrderStatus} />
                  <span className="text-sm font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  {expanded === orderId ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              {expanded === orderId && (
                <div className="border-t border-gray-50 px-5 py-4 bg-gray-50/50 space-y-2">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.product?.image_url ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                      </div>
                      <span className="flex-1 text-sm text-gray-700 font-medium">{item.product?.name || 'Product'}</span>
                      <span className="text-xs text-gray-400">x{item.quantity}</span>
                      <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
