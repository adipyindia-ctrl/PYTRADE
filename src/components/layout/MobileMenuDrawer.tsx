'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/config/navigation';

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center h-14 px-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-pytrade-blue rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-pytrade-navy text-base tracking-tight">PYTRADE</span>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-2 text-gray-500 hover:text-pytrade-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 py-3 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));

            const itemContent = (
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-blue-50 text-pytrade-blue font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-pytrade-navy',
                  !item.implemented && 'opacity-50'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
                {!item.implemented && (
                  <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                    Soon
                  </span>
                )}
              </div>
            );

            if (!item.implemented) {
              return (
                <button
                  key={item.id}
                  className="w-full text-left"
                  aria-disabled="true"
                  title="Coming Soon"
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
              >
                {itemContent}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-gray-100">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-pytrade-navy transition-colors opacity-50"
            aria-disabled="true"
            title="Coming Soon"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileMenuDrawer;
