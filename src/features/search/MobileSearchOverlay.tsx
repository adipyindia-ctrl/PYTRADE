'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatINR, formatPercent } from '@/lib/formatters';
import { mockStocks } from '@/mocks/stocks';
import type { Stock } from '@/types';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter stocks whenever query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = mockStocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(lower) ||
          s.name.toLowerCase().includes(lower)
      )
      .slice(0, 6);

    setResults(filtered);
  }, [query]);

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setQuery(stock.symbol);
    // In a real app, navigate to stock detail page here
    onClose();
  };

  const showEmptyState = query.length >= 2 && results.length === 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Search stocks"
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex-shrink-0 p-2 -ml-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close search"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks, ETFs..."
            className={cn(
              'w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl',
              'focus:outline-none focus:ring-2 focus:ring-pytrade-blue/30 focus:border-pytrade-blue',
              'transition-colors placeholder:text-gray-400'
            )}
            aria-label="Search stocks and ETFs"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Search className="h-10 w-10 text-gray-200 mb-3" aria-hidden="true" />
            <p className="text-base font-medium text-gray-600">No results found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try a different symbol or company name
            </p>
          </div>
        ) : results.length > 0 ? (
          <ul>
            {results.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <li key={stock.symbol}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    onClick={() => handleSelectStock(stock)}
                  >
                    {/* Left: symbol + name */}
                    <div className="flex flex-col min-w-0 mr-4">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-gray-500 truncate leading-snug mt-0.5">
                        {stock.name}
                      </span>
                    </div>

                    {/* Right: price + change% */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-sm font-medium text-gray-900 leading-tight">
                        {formatINR(stock.price)}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium leading-snug flex items-center gap-0.5 mt-0.5',
                          isPositive ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-3 w-3" aria-hidden="true" />
                        )}
                        {formatPercent(stock.changePercent)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          /* Idle state — show prompt */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Search className="h-10 w-10 text-gray-200 mb-3" aria-hidden="true" />
            <p className="text-sm text-gray-400">Type to search for stocks or ETFs</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSearchOverlay;
