'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PortfolioSummary } from '@/features/dashboard/PortfolioSummary';
import { MarketIndicesRow } from '@/features/dashboard/MarketIndicesRow';
import { MarketOverview } from '@/features/dashboard/MarketOverview';
import { RecentOrders } from '@/features/dashboard/RecentOrders';
import { MarketNews } from '@/features/dashboard/MarketNews';
import { QuickActions } from '@/features/dashboard/QuickActions';
import { WatchlistPreview } from '@/features/dashboard/WatchlistPreview';

function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-IN'));
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN'));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6 p-4 lg:p-6">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-pytrade-navy">Good morning, Trader 👋</h1>
            <p className="text-sm text-gray-500">
              Market is Open · Demo data as of <CurrentTime />
            </p>
          </div>
        </div>

        {/* Portfolio Summary — mobile priority 1 */}
        <PortfolioSummary />

        {/* Market Indices — mobile priority 2 */}
        <MarketIndicesRow />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <MarketOverview />
            <RecentOrders />
            <MarketNews />
          </div>
          {/* Right column (1/3) */}
          <div className="space-y-6">
            <QuickActions />
            <WatchlistPreview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
