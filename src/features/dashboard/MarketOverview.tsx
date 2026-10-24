'use client';

import { useState, useMemo } from 'react';
import { Star, ArrowUp, ArrowDown } from 'lucide-react';
import { DashboardCard, Badge } from '@/components/ui';
import { mockStocks } from '@/mocks/stocks';
import { formatINR, formatPercent, formatVolume } from '@/lib/formatters';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { toggleWatchlist } from '@/store/watchlistSlice';
import { cn } from '@/lib/utils';
import type { Stock } from '@/types';

type Tab = 'gainers' | 'losers' | 'active';
type SortKey = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume';
type SortDir = 'asc' | 'desc';

const TABS: { id: Tab; label: string }[] = [
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Top Losers' },
  { id: 'active', label: 'Most Active' },
];

function getTabData(tab: Tab): Stock[] {
  switch (tab) {
    case 'gainers':
      return [...mockStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 8);
    case 'losers':
      return [...mockStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 8);
    case 'active':
      return [...mockStocks].sort((a, b) => b.volume - a.volume).slice(0, 8);
  }
}

interface StockRowMobileProps {
  stock: Stock;
  watched: boolean;
  onToggle: () => void;
}

function StockRowMobile({ stock, watched, onToggle }: StockRowMobileProps) {
  const positive = stock.changePercent >= 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-pytrade-navy">{stock.symbol}</p>
        <p className="text-xs text-gray-400 truncate">{stock.name}</p>
      </div>
      <div className="text-right mr-2">
        <p className="text-sm font-semibold text-pytrade-navy">
          {formatINR(stock.price)}
        </p>
        <p className={cn('text-xs font-medium', positive ? 'text-positive' : 'text-negative')}>
          {formatPercent(stock.changePercent)}
        </p>
      </div>
      <button
        onClick={onToggle}
        aria-label={watched ? `Remove ${stock.symbol} from watchlist` : `Add ${stock.symbol} to watchlist`}
        className={cn(
          'p-1.5 rounded-lg transition-colors shrink-0',
          watched ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
        )}
      >
        <Star className="h-4 w-4" fill={watched ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  direction: SortDir;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right';
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  direction,
  onSort,
  align = 'right',
}: SortableHeaderProps) {
  const active = currentSort === sortKey;
  return (
    <th
      className={cn(
        'px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none',
        align === 'right' ? 'text-right' : 'text-left'
      )}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {active && (
          direction === 'desc' ? (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          )
        )}
      </span>
    </th>
  );
}

export function MarketOverview() {
  const [tab, setTab] = useState<Tab>('gainers');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const dispatch = useAppDispatch();
  const watchlistItems = useAppSelector((s) => s.watchlist.items);
  const watchedSymbols = new Set(watchlistItems.map((w) => w.symbol));

  const baseData = useMemo(() => getTabData(tab), [tab]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return baseData.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [baseData, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = 0;
      let bv = 0;
      switch (sortKey) {
        case 'symbol':
          return sortDir === 'asc'
            ? a.symbol.localeCompare(b.symbol)
            : b.symbol.localeCompare(a.symbol);
        case 'price':
          av = a.price;
          bv = b.price;
          break;
        case 'change':
          av = a.change;
          bv = b.change;
          break;
        case 'changePercent':
          av = a.changePercent;
          bv = b.changePercent;
          break;
        case 'volume':
          av = a.volume;
          bv = b.volume;
          break;
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function handleToggleWatchlist(stock: Stock) {
    dispatch(toggleWatchlist({ ...stock, isWatched: watchedSymbols.has(stock.symbol) }));
  }

  return (
    <DashboardCard title="Market Overview">
      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="search"
          placeholder="Search symbol or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-48 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pytrade-blue bg-gray-50"
          aria-label="Search stocks"
        />
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSearch('');
              }}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                t.id === tab
                  ? 'bg-pytrade-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm" aria-label="Market overview table">
          <thead>
            <tr className="border-b border-gray-100">
              <SortableHeader
                label="Symbol"
                sortKey="symbol"
                currentSort={sortKey}
                direction={sortDir}
                onSort={handleSort}
                align="left"
              />
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Name
              </th>
              <SortableHeader
                label="Price"
                sortKey="price"
                currentSort={sortKey}
                direction={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Change"
                sortKey="change"
                currentSort={sortKey}
                direction={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Chg%"
                sortKey="changePercent"
                currentSort={sortKey}
                direction={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Volume"
                sortKey="volume"
                currentSort={sortKey}
                direction={sortDir}
                onSort={handleSort}
              />
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Watch
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((stock) => {
              const positive = stock.changePercent >= 0;
              const watched = watchedSymbols.has(stock.symbol);
              return (
                <tr
                  key={stock.symbol}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2.5 text-left font-bold text-pytrade-navy text-sm">
                    {stock.symbol}
                  </td>
                  <td className="px-3 py-2.5 text-left text-gray-500 text-xs max-w-[160px] truncate">
                    {stock.name}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-pytrade-navy">
                    {formatINR(stock.price)}
                  </td>
                  <td
                    className={cn(
                      'px-3 py-2.5 text-right font-medium',
                      positive ? 'text-positive' : 'text-negative'
                    )}
                  >
                    {stock.change >= 0 ? '+' : ''}
                    {stock.change.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge variant={positive ? 'success' : 'danger'}>
                      {formatPercent(stock.changePercent)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-500 text-sm">
                    {formatVolume(stock.volume)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => handleToggleWatchlist(stock)}
                      aria-label={
                        watched
                          ? `Remove ${stock.symbol} from watchlist`
                          : `Add ${stock.symbol} to watchlist`
                      }
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        watched
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      )}
                    >
                      <Star
                        className="h-4 w-4"
                        fill={watched ? 'currentColor' : 'none'}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden">
        {sorted.map((stock) => (
          <StockRowMobile
            key={stock.symbol}
            stock={stock}
            watched={watchedSymbols.has(stock.symbol)}
            onToggle={() => handleToggleWatchlist(stock)}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-6">No stocks match your search.</p>
      )}
    </DashboardCard>
  );
}

export default MarketOverview;
