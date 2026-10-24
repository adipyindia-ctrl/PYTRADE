'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/config/navigation';

interface ComingSoonWrapperProps {
  children: React.ReactNode;
  collapsed: boolean;
}

function ComingSoonWrapper({ children, collapsed }: ComingSoonWrapperProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {children}
      {showTip && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs bg-pytrade-navy text-white rounded-md whitespace-nowrap pointer-events-none',
            collapsed ? 'left-14 top-1/2 -translate-y-1/2' : 'left-full ml-2 top-1/2 -translate-y-1/2'
          )}
        >
          Coming Soon
        </div>
      )}
    </div>
  );
}

export interface DesktopSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DesktopSidebar({ collapsed, onToggle }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-100 shadow-sm z-40 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div className="flex items-center h-[60px] px-3 border-b border-gray-100">
        <div className={cn('flex items-center gap-2 min-w-0', collapsed && 'justify-center w-full')}>
          <div className="p-1.5 bg-pytrade-blue rounded-lg shrink-0">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-pytrade-navy text-base tracking-tight truncate">
              PYTRADE
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Expand toggle when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          const itemContent = (
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-blue-50 text-pytrade-blue font-medium border-r-2 border-pytrade-blue'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-pytrade-navy'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          );

          if (!item.implemented) {
            return (
              <ComingSoonWrapper key={item.id} collapsed={collapsed}>
                <button
                  className="w-full text-left opacity-60 cursor-default"
                  title="Coming Soon"
                  aria-disabled="true"
                >
                  {itemContent}
                </button>
              </ComingSoonWrapper>
            );
          }

          return (
            <Link key={item.id} href={item.href} aria-current={isActive ? 'page' : undefined}>
              {itemContent}
            </Link>
          );
        })}
      </nav>

      {/* Bottom version info */}
      <div className="px-3 py-3 border-t border-gray-100">
        {collapsed ? (
          <div className="w-7 h-7 rounded-full bg-gray-200 mx-auto" aria-hidden="true" />
        ) : (
          <p className="text-xs text-gray-400 truncate">PYTRADE v0.1 — Demo</p>
        )}
      </div>
    </aside>
  );
}

export default DesktopSidebar;
