import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ShoppingBag, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/layout/Sidebar';

const customerNav = [
  { label: 'Dashboard', path: '/customer', icon: LayoutDashboard },
  { label: 'Browse Products', path: '/products', icon: ShoppingBag },
  { label: 'My Orders', path: '/customer/orders', icon: Package },
];

export default function CustomerLayout() {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile || profile.role !== 'customer') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <Sidebar items={customerNav} title="Customer" accent="orange" />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
