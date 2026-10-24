'use client';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppSelector } from '@/store';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { PlusCircle, MinusCircle, ArrowRight } from 'lucide-react';
import type { Transaction } from '@/store/fundsSlice';

function txnLabel(type: Transaction['type']): string {
  switch (type) {
    case 'ADD_FUNDS':
      return 'Added Funds';
    case 'WITHDRAWAL':
      return 'Withdrawal';
    case 'ORDER_DEBIT':
      return 'Order Debit';
    case 'ORDER_CREDIT':
      return 'Order Credit';
  }
}

function isCredit(type: Transaction['type']): boolean {
  return type === 'ADD_FUNDS' || type === 'ORDER_CREDIT';
}

export default function FundsPage() {
  const { balance, transactions } = useAppSelector((s) => s.funds);
  const recent = transactions.slice(0, 5);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 pb-24">
        <h1 className="text-xl font-bold text-pytrade-navy">Funds</h1>

        {/* Balance card */}
        <div className="bg-pytrade-navy rounded-2xl p-6 text-white">
          <p className="text-sm opacity-70">Demo Available Balance</p>
          <p className="text-3xl font-bold mt-1">{formatINR(balance)}</p>
          <p className="text-xs opacity-60 mt-1">Simulated balance — not real money</p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/funds/add"
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow group"
          >
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <PlusCircle className="h-6 w-6 text-positive" />
            </div>
            <span className="font-semibold text-pytrade-navy text-sm">Add Funds</span>
            <span className="text-xs text-gray-400">UPI, Net Banking, Card</span>
          </Link>
          <Link
            href="/funds/withdraw"
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow group"
          >
            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <MinusCircle className="h-6 w-6 text-negative" />
            </div>
            <span className="font-semibold text-pytrade-navy text-sm">Withdraw</span>
            <span className="text-xs text-gray-400">To linked bank</span>
          </Link>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="font-bold text-pytrade-navy text-sm">Recent Transactions</h3>
            <Link
              href="/transactions"
              className="text-xs text-pytrade-blue hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.length === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">No transactions yet</p>
            )}
            {recent.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 mr-2">
                  <p className="text-sm font-medium text-pytrade-navy truncate">
                    {txnLabel(txn.type)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {txn.method ?? txn.bankAccount ?? ''} ·{' '}
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
        </div>
      </div>
    </AppLayout>
  );
}
