import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'approved' | 'pending-approval' | 'customer' | 'vendor' | 'admin';
}

const variants: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-teal-100 text-teal-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  'pending-approval': 'bg-amber-100 text-amber-700',
  customer: 'bg-emerald-100 text-emerald-700',
  vendor: 'bg-blue-100 text-blue-700',
  admin: 'bg-rose-100 text-rose-700',
};

export default function Badge({ label, variant = 'pending' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${variants[variant] || variants.pending}`}>
      {label}
    </span>
  );
}
