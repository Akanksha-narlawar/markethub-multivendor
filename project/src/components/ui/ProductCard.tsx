import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../lib/types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { profile } = useAuth();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile) { showToast('Sign in to add items to cart', 'error'); return; }
    if (profile.role !== 'customer') { showToast('Only customers can add to cart', 'info'); return; }
    await addToCart(product.id);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <Link to={`/products/${product.id}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16v2H4V4zm0 4h16v12H4V8zm4 2v8h8v-8H8z" opacity="0.4" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-lg text-gray-600 border border-gray-100">
          {product.category}
        </span>
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{(product.vendor as { full_name?: string })?.full_name || 'Vendor'}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 flex-1 group-hover:text-orange-600 transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 bg-orange-50 hover:bg-orange-500 text-orange-500 hover:text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
