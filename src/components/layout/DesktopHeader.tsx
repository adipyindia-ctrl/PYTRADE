'use client';

import { Bell, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GlobalStockSearch } from './GlobalStockSearch';

export interface DesktopHeaderProps {
  sidebarCollapsed: boolean;
}

export function DesktopHeader({ sidebarCollapsed }: DesktopHeaderProps) {
  return (
    <header
      className={cn(
        'hidden lg:flex items-center fixed top-0 right-0 z-30 h-[60px] bg-white border-b border-gray-100 shadow-sm transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[240px]'
      )}
    >
      <div className="flex items-center w-full px-4 gap-4">
        {/* Left: page title placeholder */}
        <div className="flex-1 min-w-0" />

        {/* Center: global search */}
        <GlobalStockSearch className="w-full max-w-xs" />

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="p-2 text-gray-500 hover:text-pytrade-navy hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-2 p-1.5 text-gray-600 hover:text-pytrade-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Profile"
          >
            <div className="h-7 w-7 bg-pytrade-blue rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default DesktopHeader;
