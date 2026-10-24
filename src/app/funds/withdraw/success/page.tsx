'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatINR } from '@/lib/formatters';
import { Clock } from 'lucide-react';

function WithdrawSuccessContent() {
  const sp = useSearchParams();
  const amount = Number(sp.get('amount') ?? 0);
  const bank = sp.get('bank') ?? 'XXXXXXXX0000';
  const ref = sp.get('ref') ?? 'WD00000000';

  return (
    <div className="max-w-lg mx-auto p-4 lg:p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 mx-auto">
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold text-pytrade-navy">Withdrawal Submitted</h2>
        <p className="text-sm text-gray-500">
          Your demo withdrawal request has been submitted successfully.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              PENDING
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-pytrade-navy">{formatINR(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Destination</span>
            <span className="font-mono text-xs">{bank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Reference ID</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="text-xs">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
          Funds will be credited in 1–2 business days (demo only). No real bank transfer has
          occurred.
        </p>

        <div className="flex gap-3">
          <Link
            href="/transactions"
            className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-center hover:border-pytrade-blue hover:text-pytrade-blue transition-colors"
          >
            View Transactions
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-pytrade-blue text-white rounded-xl py-3 text-sm font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawSuccessPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
        <WithdrawSuccessContent />
      </Suspense>
    </AppLayout>
  );
}
