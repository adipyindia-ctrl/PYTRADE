'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardCard, Button, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { mockStocks } from '@/mocks/stocks';
import type { OrderType } from '@/types';

type OrderSide = 'BUY' | 'SELL';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  side: OrderSide;
}

function TradeModal({ isOpen, onClose, side }: TradeModalProps) {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState(mockStocks[0]?.symbol ?? '');
  const [quantity, setQuantity] = useState('1');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');

  const isBuy = side === 'BUY';

  function handlePlace() {
    const qty = parseInt(quantity, 10);
    if (!symbol || isNaN(qty) || qty < 1) {
      toast({ variant: 'error', title: 'Invalid input', description: 'Please enter a valid symbol and quantity.' });
      return;
    }
    toast({
      variant: 'success',
      title: `Demo ${side} order placed`,
      description: `${qty} × ${symbol} — ${orderType} · No real transaction.`,
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isBuy ? 'Buy' : 'Sell'} Order`} size="sm">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="trade-symbol" className="text-xs font-medium text-gray-600">
            Symbol
          </label>
          <select
            id="trade-symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pytrade-blue bg-white"
          >
            {mockStocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="trade-qty" className="text-xs font-medium text-gray-600">
            Quantity
          </label>
          <input
            id="trade-qty"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pytrade-blue"
            placeholder="Enter quantity"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="trade-type" className="text-xs font-medium text-gray-600">
            Order Type
          </label>
          <select
            id="trade-type"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pytrade-blue bg-white"
          >
            <option value="MARKET">MARKET</option>
            <option value="LIMIT">LIMIT</option>
            <option value="SL">SL</option>
            <option value="SL-M">SL-M</option>
          </select>
        </div>

        <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5">
          This is a demo. No real transaction will occur.
        </p>

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isBuy ? 'primary' : 'danger'}
            fullWidth
            onClick={handlePlace}
          >
            Place Demo {side}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function FundsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Funds" size="sm">
      <div className="flex flex-col items-center gap-3 py-4">
        <Wallet className="h-10 w-10 text-pytrade-blue" aria-hidden="true" />
        <p className="text-base font-semibold text-pytrade-navy">Coming Soon</p>
        <p className="text-sm text-gray-500 text-center">
          Add Funds feature will be available in a future release.
        </p>
        <Button variant="ghost" onClick={onClose} className="mt-2 w-full">
          Go Back
        </Button>
      </div>
    </Modal>
  );
}

export function QuickActions() {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [fundsOpen, setFundsOpen] = useState(false);

  return (
    <DashboardCard title="Quick Actions">
      {/* Desktop: row of 4. Mobile: 2×2 grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant="primary"
          className="flex-col sm:flex-row h-14 sm:h-auto gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={() => setBuyOpen(true)}
          aria-label="Open buy order modal"
        >
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          Buy
        </Button>
        <Button
          variant="danger"
          className="flex-col sm:flex-row h-14 sm:h-auto gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={() => setSellOpen(true)}
          aria-label="Open sell order modal"
        >
          <TrendingDown className="h-4 w-4" aria-hidden="true" />
          Sell
        </Button>
        <Button
          variant="secondary"
          className="flex-col sm:flex-row h-14 sm:h-auto gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={() => setFundsOpen(true)}
          aria-label="Open add funds modal"
        >
          <Wallet className="h-4 w-4" aria-hidden="true" />
          Add Funds
        </Button>
        <Link href="/dashboard" className="w-full">
          <Button
            variant="ghost"
            fullWidth
            className="flex-col sm:flex-row h-14 sm:h-auto gap-1 sm:gap-2 text-xs sm:text-sm"
            aria-label="View portfolio"
          >
            <BarChart2 className="h-4 w-4" aria-hidden="true" />
            Portfolio
          </Button>
        </Link>
      </div>

      <TradeModal isOpen={buyOpen} onClose={() => setBuyOpen(false)} side="BUY" />
      <TradeModal isOpen={sellOpen} onClose={() => setSellOpen(false)} side="SELL" />
      <FundsModal isOpen={fundsOpen} onClose={() => setFundsOpen(false)} />
    </DashboardCard>
  );
}

export default QuickActions;
