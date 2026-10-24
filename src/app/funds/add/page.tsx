'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { addFunds } from '@/store/fundsSlice';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type PaymentMethod = 'UPI' | 'Net Banking' | 'Debit/Credit Card';

const SUGGESTED_AMOUNTS = [1000, 5000, 10000, 25000, 50000];
const NET_BANKING_OPTIONS = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'];
const METHODS: PaymentMethod[] = ['UPI', 'Net Banking', 'Debit/Credit Card'];

export default function AddFundsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const balance = useAppSelector((s) => s.funds.balance);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numAmount = Number(amount);

  function validate(): string {
    if (!amount || isNaN(numAmount) || numAmount <= 0) return 'Please enter a valid amount.';
    if (numAmount > 100000) return 'Maximum amount per transaction is ₹1,00,000.';
    if (method === 'UPI') {
      if (!upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@upi).';
    }
    if (method === 'Net Banking') {
      if (!selectedBank) return 'Please select a bank.';
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ref = 'PAY' + Date.now().toString().slice(-8);
    dispatch(addFunds({ amount: numAmount, method, reference: ref }));
    router.push(
      `/funds/success?amount=${numAmount}&method=${encodeURIComponent(method)}&ref=${ref}`
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 pb-24">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-pytrade-navy mb-1">Add Funds</h1>
          <p className="text-xs text-amber-600 mb-6">
            Demo simulation — no real money is involved
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current balance */}
            <div className="bg-pytrade-navy rounded-2xl p-4 text-white">
              <p className="text-xs opacity-70">Demo Available Balance</p>
              <p className="text-2xl font-bold mt-0.5">{formatINR(balance)}</p>
            </div>

            {/* Amount input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-pytrade-navy">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="0"
                  min={1}
                  max={100000}
                  className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold text-pytrade-navy focus:outline-none focus:ring-2 focus:ring-pytrade-blue"
                />
              </div>
              {/* Suggested amounts */}
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_AMOUNTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setAmount(String(s));
                      setError('');
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                      numAmount === s
                        ? 'bg-pytrade-blue text-white border-pytrade-blue'
                        : 'border-gray-200 text-gray-600 hover:border-pytrade-blue hover:text-pytrade-blue'
                    )}
                  >
                    {formatINR(s, true)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <p className="text-sm font-semibold text-pytrade-navy">Payment Method</p>
              <div className="flex gap-2 flex-wrap">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMethod(m);
                      setError('');
                    }}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                      method === m
                        ? 'bg-pytrade-blue text-white border-pytrade-blue'
                        : 'border-gray-200 text-gray-600 hover:border-pytrade-blue'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* UPI */}
              {method === 'UPI' && (
                <div className="space-y-2 mt-2">
                  <label className="text-xs text-gray-500">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setError('');
                    }}
                    placeholder="yourname@upi"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pytrade-blue"
                  />
                  <p className="text-xs text-amber-700 flex items-start gap-1.5 bg-amber-50 rounded-lg p-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    This is a demo. No real UPI transaction will occur.
                  </p>
                </div>
              )}

              {/* Net Banking */}
              {method === 'Net Banking' && (
                <div className="space-y-2 mt-2">
                  <label className="text-xs text-gray-500">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => {
                      setSelectedBank(e.target.value);
                      setError('');
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pytrade-blue bg-white"
                  >
                    <option value="">Choose your bank…</option>
                    {NET_BANKING_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-amber-700 flex items-start gap-1.5 bg-amber-50 rounded-lg p-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    Demo only — no real net banking login.
                  </p>
                </div>
              )}

              {/* Card */}
              {method === 'Debit/Credit Card' && (
                <div className="mt-2 bg-amber-50 rounded-lg p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-1">Demo only — card payments are simulated.</p>
                  <p>Do NOT enter real card details. This is a demonstration environment.</p>
                </div>
              )}
            </div>

            {/* Order summary */}
            {numAmount > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-pytrade-navy mb-2">Order Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium">{formatINR(numAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processing Fee</span>
                  <span className="font-medium text-positive">₹0 (Demo)</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-pytrade-navy">{formatINR(numAmount)}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-negative rounded-xl p-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pytrade-blue text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-60 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Proceed to Demo Payment
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
