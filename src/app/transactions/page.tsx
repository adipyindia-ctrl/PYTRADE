'use client';
import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppSelector } from '@/store';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { Transaction, TransactionType } from '@/store/fundsSlice';

type TabFilter = 'all' | 'add' | 'withdraw' | 'orders';

const TAB_LABELS: Record<TabFilter, string> = {
  all: 'All',
  add: 'Add Funds',
  withdraw: 'Withdrawals',
  orders: 'Orders',
};

const TYPE_LABELS: Record<TransactionType, string> = {
  ADD_FUNDS: 'Add Funds',
  WITHDRAWAL: 'Withdrawal',
  ORDER_DEBIT: 'Order Debit',
  ORDER_CREDIT: 'Order Credit',
};

function isCredit(type: TransactionType): boolean {
  return type === 'ADD_FUNDS' || type === 'ORDER_CREDIT';
}

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { transactions, balance } = useAppSelector((s) => s.funds);
  const [tab, setTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = transactions;
    if (tab === 'add') list = transactions.filter((t) => t.type === 'ADD_FUNDS');
    if (tab === 'withdraw') list = transactions.filter((t) => t.type === 'WITHDRAWAL');
    if (tab === 'orders')
      list = transactions.filter(
        (t) => t.type === 'ORDER_DEBIT' || t.type === 'ORDER_CREDIT'
      );
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          (t.note ?? '').toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, tab, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > paginated.length;

  function handleTabChange(t: TabFilter) {
    setTab(t);
    setPage(1);
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 pb-24 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-pytrade-navy">Transactions</h1>
            <p className="text-xs text-gray-500">
              Balance: <span className="font-semibold text-pytrade-navy">{formatINR(balance)}</span>
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by reference or note…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pytrade-blue bg-white"
          />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1">
          {(Object.keys(TAB_LABELS) as TabFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors shrink-0',
                tab === t
                  ? 'bg-pytrade-blue text-white border-pytrade-blue'
                  : 'border-gray-200 text-gray-600 hover:border-pytrade-blue'
              )}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <p className="text-gray-400 text-sm">No transactions found.</p>
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="mt-2 text-pytrade-blue text-xs hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Desktop table */}
        {paginated.length > 0 && (
          <>
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Ref ID', 'Type', 'Method / Note', 'Amount', 'Status'].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((txn: Transaction) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {txn.reference}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full font-medium',
                              txn.type === 'ADD_FUNDS'
                                ? 'bg-green-50 text-positive'
                                : txn.type === 'WITHDRAWAL'
                                  ? 'bg-red-50 text-negative'
                                  : 'bg-blue-50 text-pytrade-blue'
                            )}
                          >
                            {TYPE_LABELS[txn.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">
                          {txn.method ?? txn.note ?? '—'}
                        </td>
                        <td
                          className={cn(
                            'px-4 py-3 font-semibold text-sm',
                            isCredit(txn.type) ? 'text-positive' : 'text-negative'
                          )}
                        >
                          {isCredit(txn.type) ? '+' : '-'}
                          {formatINR(txn.amount, true)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full font-medium',
                              txn.status === 'SUCCESS'
                                ? 'bg-green-50 text-positive'
                                : txn.status === 'PENDING'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-negative'
                            )}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
              {paginated.map((txn: Transaction) => (
                <div key={txn.id} className="p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-pytrade-navy truncate">
                      {TYPE_LABELS[txn.type]}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{txn.reference}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.timestamp).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isCredit(txn.type) ? 'text-positive' : 'text-negative'
                      )}
                    >
                      {isCredit(txn.type) ? '+' : '-'}
                      {formatINR(txn.amount, true)}
                    </p>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-medium',
                        txn.status === 'SUCCESS'
                          ? 'bg-green-50 text-positive'
                          : txn.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-negative'
                      )}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2.5 border-2 border-pytrade-blue text-pytrade-blue rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
