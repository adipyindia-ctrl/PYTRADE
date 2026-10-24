'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockStocks } from '@/mocks/stocks';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleWatchlist } from '@/store/watchlistSlice';
import { formatINR, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search, Trash2, BookmarkPlus } from 'lucide-react';

export default function WatchlistPage() {
  const dispatch = useAppDispatch();
  const watchlistItems = useAppSelector(s => s.watchlist.items);
  const [search, setSearch] = useState('');
  const [addSearch, setAddSearch] = useState('');
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const watchedSymbols = watchlistItems.map(i => i.symbol);

  const addSuggestions = useMemo(() => {
    if (!addSearch || addSearch.length < 1) return [];
    return mockStocks
      .filter(s => !watchedSymbols.includes(s.symbol) && (s.symbol.includes(addSearch.toUpperCase()) || s.name.toLowerCase().includes(addSearch.toLowerCase())))
      .slice(0, 6);
  }, [addSearch, watchedSymbols]);

  const filtered = useMemo(() => {
    if (!search) return watchlistItems;
    return watchlistItems.filter(s => s.symbol.includes(search.toUpperCase()) || s.name.toLowerCase().includes(search.toLowerCase()));
  }, [watchlistItems, search]);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-pytrade-navy flex items-center gap-2">
              My Watchlist{' '}
              <span className="text-sm bg-blue-50 text-pytrade-blue px-2 py-0.5 rounded-full font-medium">
                {watchlistItems.length}
              </span>
            </h1>
            <p className="text-xs text-gray-500">Track your favourite stocks</p>
          </div>
          {/* Add stock */}
          <div className="relative">
            <div className="relative">
              <BookmarkPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={addSearch}
                onChange={e => { setAddSearch(e.target.value); setShowAddDropdown(true); }}
                onFocus={() => setShowAddDropdown(true)}
                onBlur={() => setTimeout(() => setShowAddDropdown(false), 150)}
                placeholder="Add stock..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
              />
            </div>
            {showAddDropdown && addSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                {addSuggestions.map(stock => (
                  <button
                    key={stock.symbol}
                    onMouseDown={() => {
                      dispatch(toggleWatchlist({ ...stock, isWatched: true }));
                      setAddSearch('');
                      setShowAddDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                  >
                    <div>
                      <span className="font-semibold text-sm text-pytrade-navy">{stock.symbol}</span>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{stock.name}</p>
                    </div>
                    <span className={cn('text-xs font-semibold', stock.changePercent >= 0 ? 'text-positive' : 'text-negative')}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search watchlist..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
        </div>
        {/* Empty state */}
        {watchlistItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📌</p>
            <h3 className="font-bold text-pytrade-navy">Your watchlist is empty</h3>
            <p className="text-gray-500 text-sm mt-2">Use the search above to add stocks to your watchlist.</p>
          </div>
        )}
        {/* Desktop table */}
        {filtered.length > 0 && (
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Symbol', 'Company', 'Price', 'Change', 'Change%', 'Volume', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(stock => (
                    <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/stocks/${stock.symbol}`} className="font-bold text-pytrade-navy hover:text-pytrade-blue">
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[180px] truncate">{stock.name}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(stock.price)}</td>
                      <td className={cn('px-4 py-3 font-medium text-xs', stock.change >= 0 ? 'text-positive' : 'text-negative')}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </td>
                      <td className={cn('px-4 py-3 font-semibold text-xs', stock.changePercent >= 0 ? 'text-positive' : 'text-negative')}>
                        {formatPercent(stock.changePercent)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{stock.volume.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/orders/new?symbol=${stock.symbol}&side=BUY`}
                            className="text-xs bg-green-50 text-positive px-2 py-1 rounded-lg font-medium hover:bg-green-100">
                            Buy
                          </Link>
                          <button
                            onClick={() => dispatch(toggleWatchlist({ ...stock, isWatched: true }))}
                            className="text-negative hover:text-red-700 p-1"
                            aria-label="Remove from watchlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Mobile list */}
        {filtered.length > 0 && (
          <div className="sm:hidden space-y-2">
            {filtered.map(stock => (
              <div key={stock.symbol} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                <Link href={`/stocks/${stock.symbol}`} className="flex-1 min-w-0">
                  <p className="font-bold text-pytrade-navy">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                </Link>
                <div className="text-right">
                  <p className="font-semibold text-pytrade-navy text-sm">{formatINR(stock.price)}</p>
                  <p className={cn('text-xs font-semibold', stock.changePercent >= 0 ? 'text-positive' : 'text-negative')}>
                    {formatPercent(stock.changePercent)}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Link href={`/orders/new?symbol=${stock.symbol}&side=BUY`}
                    className="text-xs bg-green-50 text-positive px-2 py-1 rounded-lg font-medium text-center">
                    Buy
                  </Link>
                  <button
                    onClick={() => dispatch(toggleWatchlist({ ...stock, isWatched: true }))}
                    className="p-1 text-gray-400 hover:text-negative"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
