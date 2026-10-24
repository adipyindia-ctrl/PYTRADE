'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockStocks } from '@/mocks/stocks';
import { useAppDispatch } from '@/store';
import { placeOrder } from '@/store/ordersSlice';
import { formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { OrderSide } from '@/types';

function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const symbolParam = searchParams.get('symbol') ?? '';
  const sideParam = (searchParams.get('side') ?? 'BUY') as OrderSide;
  const [selectedSymbol, setSelectedSymbol] = useState(symbolParam);
  const [side, setSide] = useState<OrderSide>(sideParam);
  const [product, setProduct] = useState('Delivery');
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const stock = mockStocks.find(s => s.symbol === selectedSymbol.toUpperCase());
  const effectivePrice = orderType === 'MARKET' ? (stock?.price ?? 0) : limitPrice;
  const estimatedValue = qty * effectivePrice;

  const validate = () => {
    if (!stock) { setError('Please select a stock'); return false; }
    if (qty < 1) { setError('Quantity must be at least 1'); return false; }
    if (orderType === 'LIMIT' && limitPrice <= 0) { setError('Please enter a valid limit price'); return false; }
    setError('');
    return true;
  };

  const handleConfirm = async () => {
    if (!stock) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 800));
    const orderId = 'ORD' + Date.now().toString().slice(-6);
    dispatch(placeOrder({ id: orderId, symbol: stock.symbol, name: stock.name, side, quantity: qty, orderType, price: effectivePrice }));
    setPlacing(false);
    setShowReview(false);
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-pytrade-navy mb-4">Place Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-xs bg-amber-50 text-amber-700 rounded-lg p-2">⚠️ Demo order — no real trade will be placed</p>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Select Stock</label>
              <select
                value={selectedSymbol}
                onChange={e => {
                  setSelectedSymbol(e.target.value);
                  const s = mockStocks.find(x => x.symbol === e.target.value);
                  if (s) setLimitPrice(s.price);
                }}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none"
              >
                <option value="">-- Select a stock --</option>
                {mockStocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}
              </select>
            </div>
            {stock && (
              <p className="text-sm text-gray-600">
                Current Demo Price: <span className="font-semibold text-pytrade-navy">{formatINR(stock.price)}</span>
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setSide('BUY')}
                className={cn('flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors', side === 'BUY' ? 'bg-positive text-white' : 'bg-gray-100 text-gray-600')}>
                Buy
              </button>
              <button onClick={() => setSide('SELL')}
                className={cn('flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors', side === 'SELL' ? 'bg-negative text-white' : 'bg-gray-100 text-gray-600')}>
                Sell
              </button>
            </div>
            <div className="flex gap-1 text-xs">
              {['Delivery', 'Intraday', 'F&O'].map(p => (
                <button key={p} onClick={() => setProduct(p)}
                  className={cn('px-3 py-1.5 rounded-lg font-medium flex-1', product === p ? 'bg-blue-50 text-pytrade-blue border border-pytrade-blue' : 'text-gray-500 bg-gray-50')}>
                  {p}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
              <input type="number" min={1} value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Order Type</label>
              <div className="flex gap-2">
                {(['MARKET', 'LIMIT', 'SL', 'SL-M'] as const).map(t => (
                  <button key={t}
                    onClick={() => setOrderType(t === 'SL' || t === 'SL-M' ? 'MARKET' : t)}
                    className={cn('flex-1 py-2 rounded-xl text-xs font-medium transition-colors',
                      orderType === t || (t === 'SL' && orderType === 'MARKET' && false) ? 'bg-pytrade-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      orderType === t ? 'bg-pytrade-blue text-white' : '')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {orderType === 'LIMIT' && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Limit Price (₹)</label>
                <input type="number" step={0.05} value={limitPrice}
                  onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-pytrade-blue focus:outline-none" />
              </div>
            )}
            {error && <p className="text-negative text-sm">{error}</p>}
            <button onClick={() => validate() && setShowReview(true)}
              className="w-full bg-pytrade-blue text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-colors">
              Review Order
            </button>
          </div>
          {/* Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-pytrade-navy">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {[
                { l: 'Stock', v: selectedSymbol || 'Not selected', colored: false, pos: false },
                { l: 'Side', v: side, colored: true, pos: side === 'BUY' },
                { l: 'Product', v: product, colored: false, pos: false },
                { l: 'Quantity', v: qty.toString(), colored: false, pos: false },
                { l: 'Order Type', v: orderType, colored: false, pos: false },
                { l: 'Price', v: orderType === 'MARKET' ? `Market (~${formatINR(stock?.price ?? 0)})` : formatINR(limitPrice), colored: false, pos: false },
              ].map(row => (
                <div key={row.l} className="flex justify-between">
                  <span className="text-gray-500">{row.l}</span>
                  <span className={cn('font-medium', row.colored ? (row.pos ? 'text-positive' : 'text-negative') : 'text-pytrade-navy')}>
                    {row.v}
                  </span>
                </div>
              ))}
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Value</span>
                <span className="font-bold text-pytrade-navy">{formatINR(estimatedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Charges</span>
                <span className="text-gray-700">{product === 'Delivery' ? '₹0 (Zero brokerage)' : '₹20 (Demo)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Demo Balance</span>
                <span className="text-positive font-medium">₹50,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-pytrade-navy">Confirm Order</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Stock</span><span className="font-medium">{stock?.symbol}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Side</span><span className={cn('font-bold', side === 'BUY' ? 'text-positive' : 'text-negative')}>{side}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Qty</span><span className="font-medium">{qty}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{orderType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Est. Value</span><span className="font-bold text-pytrade-navy">{formatINR(estimatedValue)}</span></div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">⚠️ Demo order — no real trade will be placed</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReview(false)} className="flex-1 border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm">
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={placing}
                className="flex-1 bg-pytrade-blue text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50">
                {placing ? 'Placing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderNewPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-gray-500">Loading order form...</div>}>
        <OrderForm />
      </Suspense>
    </AppLayout>
  );
}
