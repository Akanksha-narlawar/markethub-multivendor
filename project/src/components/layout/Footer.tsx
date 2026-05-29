import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Market<span className="text-orange-400">Hub</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              A modern multi-vendor marketplace connecting buyers and sellers across every category.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Grocery" className="hover:text-white transition-colors">Grocery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Sell</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Become a Vendor</Link></li>
              <li><Link to="/vendor" className="hover:text-white transition-colors">Vendor Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} MarketHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
