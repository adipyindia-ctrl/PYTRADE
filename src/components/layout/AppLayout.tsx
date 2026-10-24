'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNavigation } from './MobileBottomNavigation';
import { MobileMenuDrawer } from './MobileMenuDrawer';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — hidden on mobile via CSS in component */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Desktop header — hidden on mobile via CSS in component */}
      <DesktopHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Mobile header — hidden on desktop via CSS in component */}
      <MobileHeader onMenuOpen={() => setMobileMenuOpen(true)} />

      {/* Mobile drawer */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile bottom nav — hidden on desktop via CSS in component */}
      <MobileBottomNavigation onMoreOpen={() => setMobileMenuOpen(true)} />

      {/* Main content area */}
      <main
        className={cn(
          'min-h-screen bg-page-bg transition-all duration-300',
          /* Desktop: offset left for sidebar, top for header */
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]',
          'lg:pt-[60px] lg:pb-4',
          /* Mobile: top for mobile header, bottom for bottom nav */
          'pt-14 pb-20'
        )}
      >
        {children}
      </main>
    </>
  );
}

export default AppLayout;
