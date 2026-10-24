'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Star, Trash2, Building2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { addBank, removeBank, setPrimaryBank } from '@/store/bankSlice';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const BANKS = [
  'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Yes Bank', 'IndusInd Bank',
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  'border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pytrade-blue w-full';
const primaryBtnCls =
  'bg-pytrade-blue text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors w-full';
const outlineBtnCls =
  'border-2 border-pytrade-blue text-pytrade-blue rounded-xl px-4 py-3 font-semibold hover:bg-blue-50 transition-colors';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const bankSchema = z
  .object({
    bankName: z.string().min(1, 'Please select a bank'),
    holderName: z.string().min(2, 'Enter at least 2 characters'),
    accountNumber: z
      .string()
      .regex(/^\d{9,18}$/, 'Account number must be 9–18 digits'),
    confirmAccount: z.string(),
    ifsc: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC. Example: HDFC0001234'),
  })
  .refine((d) => d.accountNumber === d.confirmAccount, {
    message: 'Account numbers do not match',
    path: ['confirmAccount'],
  });

type BankFormData = z.infer<typeof bankSchema>;

// ─── Link Bank Form ───────────────────────────────────────────────────────────

function LinkBankForm({ onLinked }: { onLinked: () => void }) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const linkedBanks = useAppSelector((s) => s.bank.linkedBanks);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankFormData>({ resolver: zodResolver(bankSchema) });

  const onSubmit = async (data: BankFormData) => {
    if (linkedBanks.length >= 3) {
      toast({ title: 'Maximum 3 banks allowed', variant: 'error' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    const last4 = data.accountNumber.slice(-4);
    dispatch(
      addBank({
        id: Date.now().toString(),
        bankName: data.bankName,
        maskedAccount: 'XXXXXXXX' + last4,
        ifsc: data.ifsc,
        holderName: data.holderName,
        isPrimary: false,
      })
    );
    toast({
      title: 'Bank linked successfully!',
      description: 'Demo — not a real verification',
      variant: 'success',
    });
    reset();
    onLinked();
  };

  const atMax = linkedBanks.length >= 3;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-bold text-pytrade-navy">Link Bank Account</h2>

      {atMax && (
        <p className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
          Maximum 3 bank accounts can be linked. Remove one to add another.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Bank */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
          <select {...register('bankName')} className={inputCls} disabled={atMax}>
            <option value="">Select Bank</option>
            {BANKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {errors.bankName && (
            <p className="text-negative text-sm mt-1">{errors.bankName.message}</p>
          )}
        </div>

        {/* Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
          <input
            {...register('holderName')}
            placeholder="As per bank records"
            className={inputCls}
            disabled={atMax}
          />
          {errors.holderName && (
            <p className="text-negative text-sm mt-1">{errors.holderName.message}</p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
          <input
            {...register('accountNumber')}
            type="password"
            placeholder="9–18 digit account number"
            className={inputCls}
            disabled={atMax}
          />
          {errors.accountNumber && (
            <p className="text-negative text-sm mt-1">{errors.accountNumber.message}</p>
          )}
        </div>

        {/* Confirm Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number</label>
          <input
            {...register('confirmAccount')}
            type="text"
            placeholder="Re-enter account number"
            className={inputCls}
            disabled={atMax}
          />
          {errors.confirmAccount && (
            <p className="text-negative text-sm mt-1">{errors.confirmAccount.message}</p>
          )}
        </div>

        {/* IFSC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
          <input
            {...register('ifsc', {
              setValueAs: (v: string) => v.toUpperCase(),
            })}
            placeholder="e.g. HDFC0001234"
            className={inputCls}
            disabled={atMax}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.ifsc && (
            <p className="text-negative text-sm mt-1">{errors.ifsc.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || atMax}
          className={primaryBtnCls}
        >
          {loading ? 'Verifying & Linking…' : 'Link Bank Account'}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center">
        This is a demo. No real bank verification is performed.
      </p>
    </div>
  );
}

// ─── Linked Accounts Panel ────────────────────────────────────────────────────

function LinkedAccountsPanel() {
  const dispatch = useAppDispatch();
  const linkedBanks = useAppSelector((s) => s.bank.linkedBanks);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    if (confirmRemoveId === id) {
      dispatch(removeBank(id));
      setConfirmRemoveId(null);
    } else {
      setConfirmRemoveId(id);
    }
  };

  const maskDisplay = (masked: string) => {
    const last4 = masked.slice(-4);
    return `XXXX XXXX XXXX ${last4}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-pytrade-navy">Linked Accounts</h2>
        <span className="text-sm text-gray-400">{linkedBanks.length}/3</span>
      </div>

      {linkedBanks.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <Building2 className="h-12 w-12 text-gray-200 mx-auto" />
          <p className="text-sm text-gray-500">No banks linked yet.</p>
          <p className="text-xs text-gray-400">Add your first bank account using the form.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {linkedBanks.map((bank) => (
            <div
              key={bank.id}
              className={cn(
                'rounded-xl border p-4 space-y-2 transition-colors',
                bank.isPrimary ? 'border-pytrade-blue bg-blue-50/30' : 'border-gray-200'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-pytrade-navy text-sm">{bank.bankName}</span>
                    {bank.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pytrade-blue text-white text-xs font-medium">
                        <Star className="h-3 w-3" /> Primary
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-gray-500 mt-0.5">{maskDisplay(bank.maskedAccount)}</p>
                  <p className="text-xs text-gray-500">IFSC: {bank.ifsc}</p>
                  <p className="text-xs text-gray-500">{bank.holderName}</p>
                </div>
              </div>

              {/* Confirm remove prompt */}
              {confirmRemoveId === bank.id ? (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-gray-600">Remove this bank?</span>
                  <button
                    onClick={() => handleRemove(bank.id)}
                    className="text-xs bg-negative text-white rounded-lg px-3 py-1 hover:bg-red-700 transition-colors"
                  >
                    Yes, Remove
                  </button>
                  <button
                    onClick={() => setConfirmRemoveId(null)}
                    className="text-xs border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1 flex-wrap">
                  {!bank.isPrimary && (
                    <button
                      onClick={() => dispatch(setPrimaryBank(bank.id))}
                      className={cn(outlineBtnCls, 'text-xs px-3 py-1.5')}
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmRemoveId(bank.id)}
                    className="text-xs border border-gray-200 text-gray-500 rounded-xl px-3 py-1.5 hover:border-negative hover:text-negative transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {linkedBanks.length >= 3 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Maximum 3 bank accounts linked. Remove one to add another.
        </p>
      )}
    </div>
  );
}

// ─── Main Bank Accounts Page ──────────────────────────────────────────────────

export default function BankAccountsPage() {
  const [, setRefresh] = useState(0);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-pytrade-navy">Bank Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Link and manage your bank accounts for seamless trading.
          </p>
        </div>

        {/* Desktop: side-by-side; Mobile: accounts on top, form below */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Mobile: Linked Accounts first */}
          <div className="order-1 lg:order-2 lg:w-1/2">
            <LinkedAccountsPanel />
          </div>
          {/* Mobile: Form second */}
          <div className="order-2 lg:order-1 lg:w-1/2">
            <LinkBankForm onLinked={() => setRefresh((n) => n + 1)} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
