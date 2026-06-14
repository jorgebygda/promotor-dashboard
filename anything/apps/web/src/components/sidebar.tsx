'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Stock', href: '/stock', icon: Package },
  { label: 'Calendario', href: '/calendar', icon: Calendar },
  { label: 'Reporte Rápido', href: '/report', icon: FileText },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">Merchan</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium tracking-wide uppercase">
            Dashboard
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
          Menú principal
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon
                className={cn('h-4.5 w-4.5', isActive ? 'text-white' : 'text-slate-400')}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Settings size={18} className="text-slate-400" />
          Configuración
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Cerrar sesión
        </button>

        {/* User pill */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            CR
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Carlos Ruiz</p>
            <p className="text-[10px] text-slate-400 truncate">Promotor Zona Norte</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Merchan Dashboard</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent onClose={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
