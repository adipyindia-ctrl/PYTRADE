'use client';

import { X, Star } from 'lucide-react';
import { DashboardCard, Badge, EmptyState } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { removeFromWatchlist } from '@/store/watchlistSlice';
import { formatINR, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function WatchlistPreview() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.watchlist.items);

  return (
    <DashboardCard title="Watchlist">
      {items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No stocks watched"
          description="Add stocks from the Market Overview to track them here."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" aria-label="Watchlist table">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Symbol
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Change
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Chg%
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const positive = item.changePercent >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2.5">
                        <p className="font-bold text-pytrade-navy text-sm">{item.symbol}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[100px]">{item.name}</p>
                      </td>
                      <td className="px-2 py-2.5 text-right font-semibold text-pytrade-navy text-sm">
                        {formatINR(item.price)}
                      </td>
                      <td
                        className={cn(
                          'px-2 py-2.5 text-right text-sm font-medium',
                          positive ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {item.change >= 0 ? '+' : ''}
                        {item.change.toFixed(2)}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <Badge variant={positive ? 'success' : 'danger'}>
                          {formatPercent(item.changePercent)}
                        </Badge>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <button
                          onClick={() => dispatch(removeFromWatchlist(item.symbol))}
                          aria-label={`Remove ${item.symbol} from watchlist`}
                          className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden space-y-0">
            {items.map((item) => {
              const positive = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-pytrade-navy">{item.symbol}</p>
                    <p className="text-xs text-gray-400 truncate">{item.name}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-sm font-semibold text-pytrade-navy">
                      {formatINR(item.price)}
                    </p>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        positive ? 'text-positive' : 'text-negative'
                      )}
                    >
                      {formatPercent(item.changePercent)}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromWatchlist(item.symbol))}
                    aria-label={`Remove ${item.symbol} from watchlist`}
                    className="p-1.5 rounded text-gray-300 hover:text-red-400 transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardCard>
  );
}

export default WatchlistPreview;
