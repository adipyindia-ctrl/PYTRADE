'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { MarketIndicesRow } from '@/features/dashboard/MarketIndicesRow';
import { mockStocks } from '@/mocks/stocks';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleWatchlist } from '@/store/watchlistSlice';
import { formatINR, formatPercent, formatVolume } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search, Bookmark, BookmarkCheck, ChevronUp, ChevronDown } from 'lucide-react';
import type { Stock } from '@/types';

type Tab = 'gainers' | 'losers' | 'active' | 'all';
type SortField = 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';
type SortDir = 'asc' | 'desc';

export default function MarketsPage() {
  const dispatch = useAppDispatch();
  const watchedSymbols = useAppSelector(s => s.watchlist.items.map(i => i.symbol));
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sectors = useMemo(() => {
    const unique = Array.from(new Set(mockStocks.map(s => s.sector).filter(Boolean))) as string[];
    return ['All', ...unique.sort()];
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let list: Stock[] = [...mockStocks];

    // Tab filter + sort
    if (tab === 'gainers') {
      list = list.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (tab === 'losers') {
      list = list.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (tab === 'active') {
      list = list.sort((a, b) => b.volume - a.volume);
    } else {
      // all — sort by selected column
      list = list.sort((a, b) => {
        const av = a[sortField] ?? 0;
        const bv = b[sortField] ?? 0;
        return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
      });
    }

    // Sector filter
    if (sector !== 'All') {
      list = list.filter(s => s.sector === sector);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    return list;
  }, [tab, sector, search, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field || tab !== 'all') return null;
    return sortDir === 'asc' ? <ChevronUp className="inline h-3 w-3 ml-0.5" /> : <ChevronDown className="inline h-3 w-3 ml-0.5" />;
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Demo banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700">
          ⚠️ Demo data only — not real market prices or live data.
        </div>

        {/* Indices */}
        <MarketIndicesRow />

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['gainers', 'losers', 'active', 'all'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors',
                tab === t ? 'bg-pytrade-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
              {t === 'gainers' ? 'Top Gainers' : t === 'losers' ? 'Top Losers' : t === 'active' ? 'Most Active' : 'All Stocks'}
            </button>
          ))}
        </div>

        {/* Search + Sector */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by symbol or name..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
          </div>
          <select value={sector} onChange={e => setSector(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white">
            {sectors.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    Price <SortIcon field="price" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('change')}>
                    Change <SortIcon field="change" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('changePercent')}>
                    Change% <SortIcon field="changePercent" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('volume')}>
                    Volume <SortIcon field="volume" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('marketCap')}>
                    Mkt Cap <SortIcon field="marketCap" />
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Watch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No stocks found</td></tr>
                )}
                {filtered.map(stock => {
                  const positive = stock.changePercent >= 0;
                  const watched = watchedSymbols.includes(stock.symbol);
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/stocks/${stock.symbol}`} className="font-bold text-pytrade-navy hover:text-pytrade-blue">
                          {stock.symbol}
                        </Link>
                        {stock.sector && <span className="ml-1 text-[10px] text-gray-400 hidden lg:inline">{stock.sector}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[180px] truncate">{stock.name}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatINR(stock.price)}</td>
                      <td className={cn('px-4 py-3 text-right font-medium text-xs', positive ? 'text-positive' : 'text-negative')}>
                        {positive ? '+' : ''}{stock.change.toFixed(2)}
                      </td>
                      <td className={cn('px-4 py-3 text-right font-semibold text-xs', positive ? 'text-positive' : 'text-negative')}>
                        {formatPercent(stock.changePercent)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-600">{formatVolume(stock.volume)}</td>
                      <td className="px-4 py-3 text-right text-xs text-gray-600">
                        {stock.marketCap ? formatINR(stock.marketCap, true) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => dispatch(toggleWatchlist({ ...stock, isWatched: true }))}
                          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          {watched
                            ? <BookmarkCheck className="h-4 w-4 text-pytrade-blue" />
                            : <Bookmark className="h-4 w-4 text-gray-400" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {filtered.length === 0 && <div className="text-center text-gray-400 py-8">No stocks found</div>}
          {filtered.map(stock => {
            const positive = stock.changePercent >= 0;
            const watched = watchedSymbols.includes(stock.symbol);
            return (
              <div key={stock.symbol} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <Link href={`/stocks/${stock.symbol}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-pytrade-navy">{stock.symbol}</p>
                    {stock.sector && <span className="text-[10px] text-gray-400">{stock.sector}</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                </Link>
                <div className="text-right">
                  <p className="font-semibold text-pytrade-navy text-sm">{formatINR(stock.price)}</p>
                  <p className={cn('text-xs font-semibold', positive ? 'text-positive' : 'text-negative')}>
                    {formatPercent(stock.changePercent)}
                  </p>
                </div>
                <button onClick={() => dispatch(toggleWatchlist({ ...stock, isWatched: true }))}
                  aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                  className="p-1.5 hover:bg-gray-50 rounded-xl">
                  {watched
                    ? <BookmarkCheck className="h-5 w-5 text-pytrade-blue" />
                    : <Bookmark className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
