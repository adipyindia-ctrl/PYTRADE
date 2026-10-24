'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { requestWithdrawal } from '@/store/fundsSlice';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AlertCircle, Building2 } from 'lucide-react';
import type { LinkedBank } from '@/store/bankSlice';

export default function WithdrawPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const balance = useAppSelector((s) => s.funds.balance);
  const linkedBanks = useAppSelector((s) => s.bank.linkedBanks);

  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numAmount = Number(amount);
  const selectedBank: LinkedBank | undefined = linkedBanks.find((b) => b.id === selectedBankId);

  function validate(): string {
    if (!amount || isNaN(numAmount) || numAmount <= 0) return 'Please enter a valid amount.';
    if (numAmount > balance)
      return `Amount exceeds available balance of ${formatINR(balance)}.`;
    if (!selectedBankId) return 'Please select a bank account.';
    return '';
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep('review');
  }

  async function handleConfirm() {
    if (!selectedBank) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const ref = 'WD' + Date.now().toString().slice(-8);
    dispatch(
      requestWithdrawal({
        amount: numAmount,
        bankAccount: selectedBank.maskedAccount,
        reference: ref,
      })
    );
    router.push(
      `/funds/withdraw/success?amount=${numAmount}&bank=${encodeURIComponent(selectedBank.maskedAccount)}&ref=${ref}`
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 pb-24">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-pytrade-navy mb-1">Withdraw Funds</h1>
          <p className="text-xs text-amber-600 mb-6">
            Demo simulation — no real bank transfer will occur
          </p>

          {/* Balance card */}
          <div className="bg-pytrade-navy rounded-2xl p-4 text-white mb-6">
            <p className="text-xs opacity-70">Demo Available Balance</p>
            <p className="text-2xl font-bold mt-0.5">{formatINR(balance)}</p>
            <p className="text-xs opacity-60 mt-1">Withdrawable: {formatINR(balance)}</p>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleReview} className="space-y-5">
              {/* Amount */}
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                <label className="text-sm font-semibold text-pytrade-navy">
                  Withdrawal Amount
                </label>
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
                    max={balance}
                    className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold text-pytrade-navy focus:outline-none focus:ring-2 focus:ring-pytrade-blue"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Max withdrawable: {formatINR(balance)}
                </p>
              </div>

              {/* Bank selector */}
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-pytrade-navy">Destination Account</p>

                {linkedBanks.length === 0 ? (
                  <div className="text-center py-4 space-y-2">
                    <Building2 className="h-8 w-8 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-500">No bank accounts linked.</p>
                    <Link
                      href="/bank-accounts"
                      className="text-pytrade-blue text-sm font-semibold hover:underline"
                    >
                      Link a bank account
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedBanks.map((bank) => (
                      <label
                        key={bank.id}
                        className={cn(
                          'flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors',
                          selectedBankId === bank.id
                            ? 'border-pytrade-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="bank"
                          value={bank.id}
                          checked={selectedBankId === bank.id}
                          onChange={() => {
                            setSelectedBankId(bank.id);
                            setError('');
                          }}
                          className="accent-pytrade-blue"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-pytrade-navy truncate">
                            {bank.bankName}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {bank.maskedAccount}
                          </p>
                          {bank.isPrimary && (
                            <span className="text-xs text-pytrade-blue">Primary</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-negative rounded-xl p-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-pytrade-blue text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Review Withdrawal
              </button>
            </form>
          ) : (
            /* Review step */
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-pytrade-navy">Confirm Withdrawal</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-pytrade-navy">{formatINR(numAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination</span>
                    <span className="font-mono text-xs">{selectedBank?.maskedAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-medium">{selectedBank?.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Demo Charges</span>
                    <span className="font-medium text-positive">₹0</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="font-semibold">Net Credited</span>
                    <span className="font-bold text-pytrade-navy">{formatINR(numAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                This is a simulated withdrawal. No real bank transfer will be initiated.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-200 text-gray-600 rounded-2xl py-3 font-semibold text-sm hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-pytrade-blue text-white rounded-2xl py-3 font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
