'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockIPOs } from '@/mocks/ipos';
import type { IPOItem, IPOStatus } from '@/mocks/ipos';
import { useAppDispatch, useAppSelector } from '@/store';
import { applyIPO } from '@/store/ipoSlice';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/formatters';
import { CheckCircle2 } from 'lucide-react';

function IPOCard({
  ipo,
  onApply,
  applied,
}: {
  ipo: IPOItem;
  onApply: () => void;
  applied: boolean;
}) {
  const statusColors: Record<IPOStatus, string> = {
    UPCOMING: 'bg-blue-50 text-pytrade-blue',
    OPEN: 'bg-green-50 text-positive',
    CLOSED: 'bg-gray-100 text-gray-500',
    LISTED: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Initials avatar */}
        <div className="w-12 h-12 rounded-xl bg-pytrade-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
          {ipo.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-pytrade-navy text-sm leading-tight">{ipo.company}</h3>
              <p className="text-xs text-gray-500">{ipo.sector}</p>
            </div>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full shrink-0',
                statusColors[ipo.status]
              )}
            >
              {ipo.status}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
            <div>
              <p className="font-medium text-pytrade-navy">
                ₹{ipo.priceBand.min}–{ipo.priceBand.max}
              </p>
              <p>Price Band</p>
            </div>
            <div>
              <p className="font-medium text-pytrade-navy">{ipo.lotSize} shares</p>
              <p>Lot Size</p>
            </div>
            <div>
              <p className="font-medium text-pytrade-navy">{ipo.openDate}</p>
              <p>Open Date</p>
            </div>
            <div>
              <p className="font-medium text-pytrade-navy">{ipo.closeDate}</p>
              <p>Close Date</p>
            </div>
          </div>
          {ipo.subscriptionTimes !== undefined && (
            <p className="text-xs text-positive font-medium mt-1">
              {ipo.subscriptionTimes}x subscribed
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 flex-1">{ipo.description}</p>
            {ipo.status === 'OPEN' &&
              (applied ? (
                <div className="flex items-center gap-1 text-positive text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </div>
              ) : (
                <button
                  onClick={onApply}
                  className="bg-pytrade-blue text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 shrink-0"
                >
                  Apply
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplyModal({
  ipo,
  onClose,
  onConfirm,
}: {
  ipo: IPOItem;
  onClose: () => void;
  onConfirm: (lots: number) => void;
}) {
  const [lots, setLots] = useState(1);
  const maxPrice = ipo.priceBand.max;
  const total = lots * ipo.lotSize * maxPrice;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-pytrade-navy">{ipo.company}</h3>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
          ⚠️ Demo application — not a real IPO application. No funds will be blocked.
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price Band</span>
            <span className="font-medium">
              ₹{ipo.priceBand.min}–{ipo.priceBand.max}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lot Size</span>
            <span className="font-medium">{ipo.lotSize} shares</span>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Number of Lots (Max 3)</label>
            <input
              type="number"
              min={1}
              max={3}
              value={lots}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLots(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-sm font-bold border-t pt-2">
            <span>Demo Amount</span>
            <span className="text-pytrade-navy">{formatINR(total)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lots)}
            className="flex-1 bg-pytrade-blue text-white rounded-xl py-3 text-sm font-semibold"
          >
            Apply (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IPOPage() {
  const dispatch = useAppDispatch();
  const applications = useAppSelector((s) => s.ipo.applications);
  const [tab, setTab] = useState<'ALL' | IPOStatus>('ALL');
  const [applyingIpo, setApplyingIpo] = useState<IPOItem | null>(null);
  const [successIpo, setSuccessIpo] = useState<string | null>(null);

  const filtered = mockIPOs.filter((ipo) => tab === 'ALL' || ipo.status === tab);
  const appliedIds = applications.map((a) => a.ipoId);

  const handleConfirm = (ipo: IPOItem, lots: number) => {
    dispatch(
      applyIPO({
        ipoId: ipo.id,
        company: ipo.company,
        lots,
        pricePerShare: ipo.priceBand.max,
        totalAmount: lots * ipo.lotSize * ipo.priceBand.max,
      })
    );
    setApplyingIpo(null);
    setSuccessIpo(ipo.company);
    setTimeout(() => setSuccessIpo(null), 3000);
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-pytrade-navy">IPO</h1>
          <p className="text-xs text-amber-600">
            Demo IPO listings — not real SEBI-registered offers
          </p>
        </div>

        {/* Success toast */}
        {successIpo && (
          <div className="flex items-center gap-2 bg-green-50 text-positive rounded-xl p-3 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" /> Applied for {successIpo} (Demo)
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'UPCOMING', 'OPEN', 'CLOSED', 'LISTED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                tab === t
                  ? 'bg-pytrade-blue text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* IPO list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">No IPOs in this category</div>
          )}
          {filtered.map((ipo) => (
            <IPOCard
              key={ipo.id}
              ipo={ipo}
              applied={appliedIds.includes(ipo.id)}
              onApply={() => setApplyingIpo(ipo)}
            />
          ))}
        </div>

        {/* My Applications */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h3 className="font-bold text-pytrade-navy text-sm px-4 py-3 border-b border-gray-50">
              My Demo Applications
            </h3>
            <div className="divide-y divide-gray-50">
              {applications.map((app) => (
                <div key={app.refId} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-pytrade-navy">{app.company}</p>
                    <p className="text-xs text-gray-400">
                      {app.lots} lot(s) · Ref: {app.refId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-pytrade-navy">
                      {formatINR(app.totalAmount, true)}
                    </p>
                    <span className="text-xs bg-blue-50 text-pytrade-blue px-2 py-0.5 rounded-full">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply modal */}
        {applyingIpo && (
          <ApplyModal
            ipo={applyingIpo}
            onClose={() => setApplyingIpo(null)}
            onConfirm={(lots) => handleConfirm(applyingIpo, lots)}
          />
        )}
      </div>
    </AppLayout>
  );
}
