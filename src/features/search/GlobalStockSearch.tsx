'use client';

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatINR, formatPercent } from '@/lib/formatters';
import { mockStocks } from '@/mocks/stocks';
import type { Stock } from '@/types';

interface GlobalStockSearchProps {
  className?: string;
}

export function GlobalStockSearch({ className }: GlobalStockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter stocks whenever query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
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
    setIsOpen(true);
    setActiveIndex(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectStock = useCallback((stock: Stock) => {
    setQuery(stock.symbol);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        selectStock(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const showEmptyState = isOpen && query.length >= 2 && results.length === 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input */}
      <div className="relative flex items-center">
        <Search
          className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search stocks and ETFs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search stocks, ETFs..."
          className={cn(
            'w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-pytrade-blue/30 focus:border-pytrade-blue',
            'transition-colors placeholder:text-gray-400'
          )}
        />
      </div>

      {/* Dropdown */}
      {(isOpen && results.length > 0) || showEmptyState ? (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-1.5 z-50',
            'bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'
          )}
          role="listbox"
        >
          {showEmptyState ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Search className="h-6 w-6 text-gray-300 mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-600">No results found</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Try a different symbol or company name
              </p>
            </div>
          ) : (
            <ul ref={listRef} className="py-1">
              {results.map((stock, idx) => {
                const isPositive = stock.changePercent >= 0;
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={stock.symbol}
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors',
                      isActive ? 'bg-pytrade-blue/5' : 'hover:bg-gray-50'
                    )}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur before click fires
                      selectStock(stock);
                    }}
                  >
                    {/* Left: symbol + name */}
                    <div className="flex flex-col min-w-0 mr-3">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-gray-500 truncate leading-tight">
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
                          'text-xs font-medium leading-tight flex items-center gap-0.5',
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default GlobalStockSearch;
