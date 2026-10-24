'use client';

import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalStockSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks, indices…"
        className={cn(
          'w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-pytrade-blue/30 focus:border-pytrade-blue',
          'transition-colors'
        )}
        aria-label="Search stocks and indices"
      />
      {query && (
        <button
          onClick={clear}
          className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default GlobalStockSearch;
