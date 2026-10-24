'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileBottomNavItems } from '@/config/navigation';

interface MobileBottomNavigationProps {
  onMoreOpen?: () => void;
}

export function MobileBottomNavigation({ onMoreOpen }: MobileBottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100"
      aria-label="Mobile bottom navigation"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch h-[60px]">
        {/* Main nav items */}
        {mobileBottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href));

          const content = (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-pytrade-blue' : 'text-gray-500'
              )}
            >
              <Icon
                className={cn('h-5 w-5', isActive ? 'text-pytrade-blue' : 'text-gray-500')}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </div>
          );

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex-1 flex"
              aria-current={isActive ? 'page' : undefined}
            >
              {content}
            </Link>
          );
        })}

        {/* More button — opens the full nav drawer */}
        <button
          onClick={onMoreOpen}
          className="flex-1 flex"
          aria-label="More navigation options"
        >
          <div className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:text-pytrade-navy">
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>More</span>
          </div>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNavigation;
