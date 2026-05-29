import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/layout/Sidebar';

const vendorNav = [
  { label: 'Dashboard', path: '/vendor', icon: LayoutDashboard },
  { label: 'My Products', path: '/vendor/products', icon: Package },
  { label: 'Orders', path: '/vendor/orders', icon: ShoppingCart },
];

export default function VendorLayout() {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile || profile.role !== 'vendor') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <Sidebar items={vendorNav} title="Vendor" accent="blue" />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
