'use client';

import Link from 'next/link';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function AccountActivatedPage() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6 sm:p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-pytrade-blue rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-pytrade-navy tracking-tight">PYTRADE</span>
        </div>

        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-positive" />
        </div>

        <h1 className="text-2xl font-bold text-pytrade-navy mb-2">Your Account is Ready!</h1>
        <p className="text-gray-500 text-sm mb-5">Welcome to PYTRADE Demo</p>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
          <p className="text-amber-800 text-xs font-medium">
            Disclaimer: This is a demo account. No real trades or funds are involved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/kyc"
            className="block w-full border-2 border-pytrade-blue text-pytrade-blue rounded-xl px-4 py-3 font-semibold text-center hover:bg-blue-50 transition-colors"
          >
            Complete KYC
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Demo account — not a real brokerage account
        </p>
      </div>
    </div>
  );
}
