'use client';

import { Search, Bell, User } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export interface MobileHeaderProps {
  onMenuOpen?: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center h-full px-4 gap-3">
        {/* Logo — tappable to open menu */}
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-1.5 min-w-0"
          aria-label="Open navigation menu"
        >
          <div className="p-1.5 bg-pytrade-blue rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-pytrade-navy text-sm tracking-tight">PYTRADE</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-gray-500 hover:text-pytrade-navy rounded-lg transition-colors"
            aria-label="Search stocks"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            className="p-2 text-gray-500 hover:text-pytrade-navy rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
          </button>

          <Link
            href="/profile"
            className="p-1.5 text-gray-500 hover:text-pytrade-navy rounded-lg transition-colors"
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

export default MobileHeader;
