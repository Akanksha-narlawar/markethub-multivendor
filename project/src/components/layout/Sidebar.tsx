import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  title: string;
  accent?: string;
}

export default function Sidebar({ items, title, accent = 'orange' }: SidebarProps) {
  const location = useLocation();

  const accentClasses: Record<string, { active: string; hover: string; dot: string }> = {
    orange: { active: 'bg-orange-50 text-orange-700 font-semibold', hover: 'hover:bg-orange-50 hover:text-orange-600', dot: 'bg-orange-500' },
    blue: { active: 'bg-blue-50 text-blue-700 font-semibold', hover: 'hover:bg-blue-50 hover:text-blue-600', dot: 'bg-blue-500' },
    rose: { active: 'bg-rose-50 text-rose-700 font-semibold', hover: 'hover:bg-rose-50 hover:text-rose-600', dot: 'bg-rose-500' },
  };

  const a = accentClasses[accent] || accentClasses.orange;

  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-24">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">{title}</p>
        <nav className="space-y-1">
          {items.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? a.active : `text-gray-600 ${a.hover}`}`}
              >
                {isActive && <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />}
                {!isActive && <span className="w-1.5 h-1.5 rounded-full bg-transparent" />}
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
