import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Tag, Layers, Loader2, Store } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { profile } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*, vendor:profiles(full_name, email)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data as Product | null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!profile) { showToast('Sign in to add items to cart', 'error'); navigate('/login'); return; }
    if (profile.role !== 'customer') { showToast('Only customers can add to cart', 'info'); return; }
    setAdding(true);
    await addToCart(product!.id, qty);
    showToast(`${product!.name} added to cart!`, 'success');
    setAdding(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
    </div>
  );

  if (!product) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Product not found</h2>
      <Link to="/products" className="text-orange-500 hover:underline">Back to Products</Link>
    </div>
  );

  const vendor = product.vendor as { full_name?: string; email?: string } | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm aspect-square flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-300 flex flex-col items-center gap-2">
                <Package className="w-20 h-20" />
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">{product.category}</span>
              {product.stock === 0 && <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">Out of Stock</span>}
              {product.stock > 0 && product.stock <= 10 && <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">Only {product.stock} left</span>}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
              <Store className="w-4 h-4" />
              <span>Sold by <span className="font-semibold text-gray-700">{vendor?.full_name || 'Vendor'}</span></span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 text-base">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-semibold text-gray-700">{product.category}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <Layers className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Stock</p>
                  <p className="text-sm font-semibold text-gray-700">{product.stock} units</p>
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <label className="text-sm font-medium text-gray-600">Qty:</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                  >-</button>
                  <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                  >+</button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
