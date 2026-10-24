'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppSelector } from '@/store';
import { formatINR } from '@/lib/formatters';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
  const sp = useSearchParams();
  const amount = Number(sp.get('amount') ?? 0);
  const method = sp.get('method') ?? 'UPI';
  const ref = sp.get('ref') ?? 'PAY000000';
  const balance = useAppSelector((s) => s.funds.balance);

  return (
    <div className="max-w-lg mx-auto p-4 lg:p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-positive mx-auto" />
        <h2 className="text-xl font-bold text-pytrade-navy">Demo Payment Successful</h2>

        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Added</span>
            <span className="font-bold text-positive">{formatINR(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Method</span>
            <span className="font-medium">{method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Reference ID</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{ref}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-gray-500">Updated Balance</span>
            <span className="font-bold text-pytrade-navy">{formatINR(balance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="text-xs">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
          This is a simulated payment. No real money was transferred.
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

export default function FundsSuccessPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
        <SuccessContent />
      </Suspense>
    </AppLayout>
  );
}
