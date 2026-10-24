'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Products', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Learn', href: '#learn' },
  { label: 'Support', href: '#support' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pytrade-blue rounded-md"
            aria-label="PYTRADE home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pytrade-blue">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-pytrade-navy tracking-tight">PYTRADE</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-pytrade-navy rounded-md transition-colors hover:bg-gray-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-100 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-pytrade-blue hover:bg-blue-700 rounded-lg transition-colors"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-11 w-11 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-gray-100 bg-white pb-4 pt-2"
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 px-4">
              <Link
                href="/dashboard"
                className="flex h-11 w-full items-center justify-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="#"
                className="flex h-11 w-full items-center justify-center text-sm font-medium text-white bg-pytrade-blue hover:bg-blue-700 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Open Free Account
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default LandingNav;
