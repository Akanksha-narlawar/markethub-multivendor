import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!profile) return '/';
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'vendor') return '/vendor';
    return '/customer';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Market<span className="text-orange-500">Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className={`text-sm font-medium transition-colors hover:text-orange-500 ${isActive('/products') ? 'text-orange-500' : 'text-gray-600'}`}>
              Browse
            </Link>
            {user && profile && (
              <Link to={getDashboardPath()} className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1 ${location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor') || location.pathname.startsWith('/customer') ? 'text-orange-500' : 'text-gray-600'}`}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user && profile?.role === 'customer' && (
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{profile?.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                        ${profile?.role === 'admin' ? 'bg-rose-100 text-rose-700' : ''}
                        ${profile?.role === 'vendor' ? 'bg-blue-100 text-blue-700' : ''}
                        ${profile?.role === 'customer' ? 'bg-emerald-100 text-emerald-700' : ''}
                      `}>
                        {profile?.role}
                      </span>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {profile?.role === 'customer' && (
                      <Link
                        to="/customer/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          <Link to="/products" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Browse Products</Link>
          {user && profile && (
            <Link to={getDashboardPath()} className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block py-2 text-sm font-medium text-orange-500" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
}
