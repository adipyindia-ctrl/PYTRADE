import {
  Home,
  BarChart2,
  BookOpen,
  ClipboardList,
  PieChart,
  Wallet,
  TrendingUp,
  FileText,
  GraduationCap,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  implemented: boolean;
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home, implemented: true },
  { id: 'markets', label: 'Markets', href: '/markets', icon: BarChart2, implemented: true },
  { id: 'watchlist', label: 'Watchlist', href: '/watchlist', icon: BookOpen, implemented: true },
  { id: 'orders', label: 'Orders', href: '/orders', icon: ClipboardList, implemented: true },
  { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: PieChart, implemented: false },
  { id: 'funds', label: 'Funds', href: '/funds', icon: Wallet, implemented: false },
  { id: 'ipo', label: 'IPO', href: '/ipo', icon: TrendingUp, implemented: false },
  { id: 'reports', label: 'Reports', href: '/reports', icon: FileText, implemented: false },
  { id: 'learn', label: 'Learn', href: '/learn', icon: GraduationCap, implemented: false },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings, implemented: false },
];

export const mobileBottomNavItems = navItems.filter((item) =>
  ['home', 'markets', 'watchlist', 'orders', 'portfolio'].includes(item.id)
);
