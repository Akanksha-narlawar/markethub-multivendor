import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, HeartHandshake, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';
import ProductCard from '../components/ui/ProductCard';
import { CATEGORIES } from '../lib/types';

const HERO_IMAGE = 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
  Fashion: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
  Grocery: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
  Books: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Home & Garden': 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
  Sports: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, vendor:profiles(full_name, email)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setFeatured((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gray-900 overflow-hidden min-h-[560px] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-5">
              <Star className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Multi-Vendor Marketplace</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Discover Products<br />From Every <span className="text-orange-400">Vendor</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Shop from thousands of sellers across Electronics, Fashion, Grocery, and more — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-orange-500/30"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all backdrop-blur-sm"
              >
                Sell with Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map(cat => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={CATEGORY_IMAGES[cat] || 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold text-center leading-tight">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Multiple vendors, quick dispatch to your door', color: 'from-blue-500 to-cyan-500' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Secure Payments', desc: 'Your transactions are protected and encrypted', color: 'from-emerald-500 to-teal-500' },
              { icon: <HeartHandshake className="w-6 h-6" />, title: 'Vendor Verified', desc: 'All vendors are vetted and approved by our team', color: 'from-orange-500 to-rose-500' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Products</h2>
              <p className="text-gray-500 text-sm mt-1">Fresh arrivals from our top vendors</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No products yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Selling on MarketHub</h2>
          <p className="text-gray-300 mb-8 text-lg">Join our growing community of vendors and reach thousands of customers.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-orange-500/30 text-lg"
          >
            Become a Vendor <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
